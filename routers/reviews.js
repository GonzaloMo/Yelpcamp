const express = require('express');
const router = express.Router({ mergeParams: true }); // To access the id parameter from app.js
const catchAsync = require('../utils/catchAsync');

// Require the middleware
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware/index.js');

// Require the controllers
const review = require('../controllers/reviews.js');

router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));


module.exports = router;