const express = require('express');
const router = express.Router();
const Image = require('../models/image.model');
const mongoose = require('mongoose');
const User = require('../models/user.model')


router.get('/mypage', async (req, res) => {
    try {
        const user = await User.findById(new mongoose.Types.ObjectId(req.session.uid));
        const images = await Image.find({ uploadedBy: user._id });
        res.render('mypage.views.ejs',{ images : images });
    } catch (err) {
    console.error(err);
  }
});

module.exports = router;