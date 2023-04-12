const express = require('express');
const router = express.Router();
const loginmodel = require('../models/login.model');
const sessionFlash = require('../utils/session-flash');



router.get('/login', (req, res) => {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            password: '',
        }
        res.render('login.views.ejs', { inputData: sessionData })
    } else { 
        res.render('login.views.ejs', { inputData: sessionData }); 
    }
});


router.post('/login', async (req, res) => {
    const user = new loginmodel(
        req.body.email,
        req.body.password
    );
    // new loginmodel을 사용하면 loginmodel 클래스에서 this를 사용가능!

    let hasError = false;

    const existinguser = await user.matchuser();
    if (!existinguser) {
        console.log('Incorrect user email');
        sessionFlash.flashDataToSession(req, {
            errmessage: '아이디가 일치하지 않습니다.',
            email: req.body.email,
            password: req.body.password
        });
        hasError = true;
        res.redirect('/login');
        return;
        // return을 해줘야지 아래의 코드가 실행되지 않는다.
        // 안해주면 matchpassword에서 비교할 user가 없어서 에러가 난다.
    };

    const passwordmatch = await user.matchpassword();
    if (!passwordmatch) {
        console.log('Incorrect user password');
        sessionFlash.flashDataToSession(req, {
            errmessage: '비밀번호가 일치하지 않습니다.',
            email: req.body.email,
            password: req.body.password
        });
        hasError = true;
        res.redirect('/login');
        return;
    }; // 비번 확인

    if (!hasError) {
        function createUserSession (req, user, action) {
            req.session.uid = user._id.toString(); 
            req.session.save(action); 
        } // 유저의 세션을 만들어주는 함수이다. action은 세션을 만들고 뒤에 실행하는 함수

        createUserSession(req, existinguser, function(err){
            if (err) {
                console.log(err);
            } else {
                res.redirect('/');
            }
            // 세션을 만들고 나서 콜백함수를 실행한다. 콜백함수는 세션을 만들고 나서 실행되는 함수!
            // 따라서 무조건 세션이 만들어지고 나서 redirect이 실행된다!
        });
    } 
});


module.exports = router;