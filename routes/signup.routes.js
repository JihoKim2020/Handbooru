const express = require('express');
const router = express.Router();
const usermodel = require('../models/signup.model');



router.get('/signup', (req, res) => {
    res.render('signup.views.ejs');
});

router.post('/signup', async (req, res) => {
    const user = new usermodel(
        req.body.name,
        req.body.email,
        req.body.password
    );

    await user.signup();

    res.redirect('/login');
});


module.exports = router;