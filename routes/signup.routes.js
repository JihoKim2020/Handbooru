const express = require('express');
const router = express.Router();
const signupmodel = require('../models/signup.model');



router.get('/signup', (req, res) => {
    res.render('signup.views.ejs');
});

router.post('/signup', async (req, res) => {
    const user = new signupmodel(
        req.body.name,
        req.body.email,
        req.body.password
    );

    await user.signup();

    res.redirect('/login');
});


module.exports = router;