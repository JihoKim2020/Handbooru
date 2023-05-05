var mongoose = require('mongoose')

var imageSchema = new mongoose.Schema({
    imgdiscription: String,
    model: String,
    extranetwork: String,
    img:
    {
        data: Buffer,
        contentType: String,
    }
})

module.exports = mongoose.model('Image', imageSchema, 'imgcol');