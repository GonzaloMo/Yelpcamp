const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const multer  = require('multer');
const { storage } = require('../cloudinary/index.js');
const upload = multer({ storage });

// Require the isLoggedIn middleware
const { isLoggedIn, validateCampground, isAuthor} = require('../middleware/index.js'); // Require the isLoggedIn middleware

// Require the controllers
const campgrounds = require('../controllers/campgrounds.js'); 


router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));
router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editFormCampground))



module.exports = router;