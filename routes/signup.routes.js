const express = require('express');
const router = express.Router();
const { userDB } = require('../database/MongoDB');
const signupmodel = require('../models/signup.model');
const sessionFlash = require('../utils/session-flash');


router.get('/signup', (req, res) => {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            name: '',
            email: '',
            password: '',
        }
    } else { 
        res.render('signup.views.ejs', { inputData: sessionData }); 
    }
});

router.post('/signup', async (req, res) => {
    const user = new signupmodel(
        req.body.name,
        req.body.email,
        req.body.password
    );

    async function checkEmailExists(email) {
        const user = await userDB.findOne({ email: email })
        if (user) {
            return false;
        } else {
            return true;
        }
    } // 이메일 중복 확인하는 함수

    const emailcheck = await checkEmailExists(req.body.email);
    // 이메일 중복이면 false, 아니면 true

    if (!emailcheck) {
        console.log('email already exists');
        sessionFlash.flashDataToSession(req, {
            errmessage: '이미 존재하는 이메일입니다.',
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
            // 이메일 중복이면 세션에 메시지와 입력값을 저장
        }, function () {
            res.redirect('/signup');
        })
        return;
        // 이메일 중복(false)이면 리다이렉트
    } else {
        try {
            await user.signup();
        } catch (err) {
            console.log(err);
            next(err);
            return;
        }
        // 이메일 중복아니면(true) 회원가입 함수 실행
    };


    res.redirect('/login');
});


module.exports = router;