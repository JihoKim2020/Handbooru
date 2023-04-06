const express = require('express');
const router = express.Router();
const loginmodel = require('../models/login.model');

router.get('/login', (req, res) => {
    res.render('login.views.ejs');
});

router.post('/login', async (req, res) => {
    const user = new loginmodel(
        req.body.email,
        req.body.password
    );

    const existinguser = await user.matchuser();
    if (!existinguser) {
        console.log('user does not exist, signup first');
        res.redirect('/login');
        return;
    }

    const passwordmatch = await user.matchpassword(existinguser.password);
    if (!passwordmatch) {
        console.log('password does not match');
        res.redirect('/login');
        return;
    }

    function createUserSession (req, user, action) {
        req.session.uid = user._id.toString(); 
        req.session.save(action); 
    } // 유저의 세션을 만들어주는 함수이다.

    createUserSession(req, existinguser, function(){});
    // 세션을 만들고 나서 콜백함수를 실행한다. 
    
    res.redirect('/login');
});


module.exports = router;