const Campground = require('../models/campground'); 
const Review = require('../models/review'); 

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const review = new Review({ author: user, ...req.body.review});
    const campground = await Campground.findById(id);  
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created Review'); // Flash message
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted Review!'); // Flash message
    res.redirect(`/campgrounds/${id}`);
};