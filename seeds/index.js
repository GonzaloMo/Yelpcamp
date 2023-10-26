// Random data generator for the database
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');

const Image = require('./imgSchema');
const { descriptors, places, seedImg, lorem } = require('./seedHelpers');

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
const getImages = async () => {
    const rnd = Math.floor(Math.random() * 4)+1;
    const images = [];
    for (let i = 0; i < rnd; i++) {
        const random = Math.floor(Math.random() * 50);
        const image = await Image.findOne().skip(random);
        images.push({url: image.url, filename: image.filename});
    }
    return images;
}

const sample = array => array[Math.floor(Math.random() * array.length)];
// clear the database and 
const seedDB = async () => {
    await Campground.deleteMany({});
    
    for (let i = 0; i < 200; i++) {
        try {
            const images = await getImages();
            const random1000 = Math.floor(Math.random() * 1000);
            const city = cities[random1000]
            const price = Math.floor(Math.random() * 20) + 10;
            const title = `${sample(descriptors)} ${sample(places)}`;        
            const camp = new Campground({
                location: `${city.city}, ${city.state}`,
                geometry: {
                    type: "Point",
                    coordinates: [city.longitude, city.latitude]
                },
                title: title,
                images: images,
                description: lorem.generateParagraphs(3),
                price: price,
                reviews: []
            });
            const random1 =Math.random();
            if (random1 < 0.5) {
                camp.author = "653a3a631039f713e10c6b9c"
            } else {
                camp.author = "653a38d9b74879573b7eb0f2"
            }
            await camp.save();
        } catch (e) {
            console.log(e);

        }
    }
}

seedDB().then(() => {
    mongoose.connection.close();
}
);
