const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('main.views.ejs');
});

module.exports = router;