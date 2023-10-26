const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

userSchema = new Schema({
    email: {
        type:String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose); // adds a username and password field to our schema and other methods

module.exports = mongoose.model('User', userSchema);