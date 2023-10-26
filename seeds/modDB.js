// Random data generator for the database
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // Require mapbox
const mapBoxToken = "pk.eyJ1IjoiZ205NyIsImEiOiJjbG83YXhzc3MwM3Z1MmpuNjg4dDVlN3AyIn0.-vFbZ62prMf4MZJ0IsU1wg"; // Get mapbox token from .env file
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); // Create geocoder

// Connect to the database
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

// clear the database and 
const seedDB = async () => {
    const campgrounds = await Campground.find({});
    for (let campground of campgrounds) {
    }
    
}

seedDB().then(() => {
    mongoose.connection.close();
}
);
