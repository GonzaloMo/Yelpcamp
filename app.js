if  (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Require packages: express, path, mongoose
const express = require('express'); // To use express
const MongoStore = require('connect-mongo'); // To use connect-mongo
const path = require('path');  // To use the path.join() method
const mongoose = require('mongoose'); // To connect to the database
const methodOverride = require('method-override'); // To use PUT and DELETE requests
const ejsmate = require('ejs-mate'); // To use ejs-mate as the view engine
const session = require('express-session'); // To use sessions
const flash = require('connect-flash'); // To use flash messages
const mongoSanitize = require('express-mongo-sanitize'); // To sanitize user input
const helmet = require('helmet'); // To use helmet
const { scriptSrcUrls, styleSrcUrls, connectSrcUrls, fontSrcUrls } = require('./utils/permisions'); // To use helmet

const ExpressError = require('./utils/ExpressError'); // To throw errors
const { campgroundSchema, reviewSchema } = require('./schemas.js'); // To validate data
const passport = require('passport'); // To use passport
const LocalStrategy = require('passport-local'); // To use passport-local
const User = require('./models/user'); // To use the User model




// Require routers
const campgrounds = require('./routers/campgrounds');   
const reviews = require('./routers/reviews');
const users = require('./routers/users');
const dbURL = 'mongodb://127.0.0.1:27017/yelp-camp'; //  process.env.DB_URL

// Connect to the database
mongoose.connect(dbURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

// Configurations
const app = express();

app.engine('ejs', ejsmate); // To use ejs-mate as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true })); // To parse the body of a POST request
app.use(methodOverride('_method')); // To use PUT and DELETE requests
app.use(express.static(path.join(__dirname, 'public'))); // To serve static files
app.use(mongoSanitize()); // To sanitize user input


// Session Setup
const store = MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60, // In seconds
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on('error', function(e) {
    console.log('Session store error', e);
});

const sessionConfig = {
    store,
    name: "MySession",
    secret: "Betterkeepthissecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // To prevent cross-site scripting ( Security )
        // secure: false, // To use https ( Security )
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days ( Date in ms )
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
};
app.use(session(sessionConfig));
app.use(flash()); // To use flash messages
app.use(helmet()); // To use helmet

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dpyygqnhk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize()); // To initialize passport
app.use(passport.session()); // To use passport session
passport.use(new LocalStrategy(User.authenticate())); // To use passport-local

passport.serializeUser(User.serializeUser()); // To serialize the user
passport.deserializeUser(User.deserializeUser()); // To deserialize the user

// Flash middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user; // To use the currentUser variable in every template
    res.locals.success = req.flash("success"); // To use flash messages
    res.locals.error = req.flash("error"); // To use flash messages
    next();
});

// Routes order matters
app.use('/campgrounds', campgrounds); // To use the campgrounds router
app.use('/campgrounds/:id/reviews', reviews); // To use the reviews router
app.use('/', users); // To use the users router

app.get('/', (req, res) => {
    res.render('home');
});


// Error handling
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error', { err }); 
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});