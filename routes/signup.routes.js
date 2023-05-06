const express = require('express');
const router = express.Router();
const User = require('../models/user.model')
const sessionFlash = require('../utils/session-flash');
bcrypt = require('bcrypt');


router.get('/signup', (req, res) => {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            name: '',
            email: '',
            password: '',
        }
        res.render('signup.views.ejs', { inputData: sessionData }); 
    } else { 
        res.render('signup.views.ejs', { inputData: sessionData }); 
    }
});

router.post('/signup', async (req, res) => {
    const {name, email, password} = req.body;
    //Form data를 불러온다

    const cryptedpassword = await bcrypt.hash(password, 12);
    //패스워드 암호화

    const user = new User({
        name: name, 
        email: email, 
        password: cryptedpassword})

    async function checkEmailExists(email) {
        const isValiduser = await User.findOne({ email: email })
        if (isValiduser) {
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
            await user.save();
            console.log('User data added to database')
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