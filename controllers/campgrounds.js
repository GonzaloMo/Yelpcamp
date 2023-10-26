const Campground = require('../models/campground'); // Require the Campground model
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // Require mapbox
const mapBoxToken = process.env.MAPBOX_TOKEN; // Get mapbox token from .env file
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); // Create geocoder

const { cloudinary } = require('../cloudinary'); // Require cloudinary


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
};


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    const geoData = await geocoder.forwardGeocode({ 
        query: campground.location,
        limit: 1
        }).send();
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename})); 
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!'); // Flash message
    res.redirect(`/campgrounds/${campground._id}`);
};


module.exports.showCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');  
    if (!campground) {
        req.flash('error', 'Cannot find that campground!'); // Flash message
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
};

module.exports.editFormCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);  
    if (!campground) {
        req.flash('error', 'Cannot find that campground!'); // Flash message
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename})); // req.files is an array of objects
    campground.images.push(...imgs); // req.files is an array of objects
    await campground.save();
    console.log(req.body.deleteImages)
    if (req.body.deleteImages) {
        for (let url_filename of req.body.deleteImages) { 
            filename = url_filename.split(' ')[1];
            url = url_filename.split(' ')[0];
            await campground.updateOne({ $pull: { images: { filename: filename } } }); // Delete images
            if(url.includes("cloudinary")) {
                await cloudinary.uploader.destroy(filename); // Delete images from cloudinary
            }
    }}
    req.flash('success', 'Successfully updated campground!'); // Flash message
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!'); // Flash message
    res.redirect('/campgrounds');
};
