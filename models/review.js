const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    rating: {
        type: Number,
        required: true,
    },
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
});

module.exports = mongoose.model('Review', ReviewSchema);