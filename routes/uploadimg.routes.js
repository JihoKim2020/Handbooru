const express = require('express');
const router = express.Router();

router.get ('/upload', (req, res) => {
    res.render('uploadimg.views.ejs');
});

router.post('/upload', (req, res) => {
    console.log(req.body);
    res.send('uploaded');
});

module.exports = router;
