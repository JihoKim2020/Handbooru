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
    // new loginmodel을 사용하면 loginmodel 클래스에서 this를 사용가능!

    const existinguser = await user.matchuser();
    if (!existinguser) {
        console.log('user does not exist, signup first');
        res.redirect('/login');
        return;
    } // 아이디 확인

    const passwordmatch = await user.matchpassword();
    if (!passwordmatch) {
        console.log('Incorrect password');
        res.redirect('/login');
        return;
    } // 비번 확인

    function createUserSession (req, user, action) {
        req.session.uid = user._id.toString(); 
        req.session.save(action); 
    } // 유저의 세션을 만들어주는 함수이다. action은 세션을 만들고 뒤에 실행하는 함수

    createUserSession(req, existinguser, function(){});
    // 세션을 만들고 나서 콜백함수를 실행한다. 
    
    res.redirect('/');
});


module.exports = router;