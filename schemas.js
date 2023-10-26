const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Joi extension to sanitize html
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.sanitize': '{{#label}} contains disallowed HTML!'
    },
    rules: {
        sanitize: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                if (clean !== value) return helpers.error('string.sanitize', { value })
                return clean;
            }
        }
    }
});

// Joi instance with extension
const Joi = BaseJoi.extend(extension);


module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().sanitize(),
        price: Joi.number().required().min(0),
        // image: Joi.string().required(),
        location: Joi.string().required().sanitize(),
        description: Joi.string().required().sanitize()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().sanitize()
    }).required()
});