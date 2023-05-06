var mongoose = require('mongoose')

var imageSchema = new mongoose.Schema({
    imgdiscription: String,
    model: String,
    extranetwork: String,
    img:
    {
        data: Buffer,
        contentType: String,
    },
    uploadedBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Image', imageSchema, 'images');