const mongoose = require('mongoose');
const axios = require('axios');

const ImageSchema = require('./imgSchema');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

// Generate random images
const seedImg = async function() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'Sx0QxRA0WBaAU9TlKnL4_apKIIYWbkeNxVmnxUIzOgM',
          collections: 1114848,
        },
      })
      console.log(resp.data.urls.small)
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  } 

const createImageDataBase = async function () {
    const Image = mongoose.model('Image', ImageSchema);
    for (let i = 0; i < 50; i++) {
        const url = await seedImg();
        const filename = url.split('/')[3].split('?')[0];
        if (url){
            const image = new Image({
                url: url,
                filename: `YelpCamp/${filename}_${i}`	
            })
            await image.save();
        }
    }
}

createImageDataBase().then(() => {
    mongoose.connection.close();
})
