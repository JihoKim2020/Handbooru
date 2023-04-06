const express = require('express');
const router = express.Router();
const usermodel = require('../models/signup.model');

router.get('/login', (req, res) => {
    res.render('login.views.ejs');
});

router.post('/login', async (req, res) => {
    const user = new usermodel(
        req.body.email,
        req.body.password
    );

    await user.login();
    
    res.redirect('/login');
});




module.exports = router;