const express = require('express');
const router = express.Router();
const Image = require('../models/image.model');


router.get('/', async (req, res) => {
    try {
        const images = await Image.find();
        res.render('main.views.ejs',{ images });
    } catch (err) {
    console.error(err);
  }
});

module.exports = router;