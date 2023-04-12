[1mdiff --git a/routes/login.routes.js b/routes/login.routes.js[m
[1mindex 8089bea..7f213b3 100644[m
[1m--- a/routes/login.routes.js[m
[1m+++ b/routes/login.routes.js[m
[36m@@ -1,15 +1,25 @@[m
 const express = require('express');[m
 const router = express.Router();[m
 const loginmodel = require('../models/login.model');[m
[32m+[m[32mconst sessionFlash = require('../utils/session-flash');[m
 [m
 [m
 [m
 router.get('/login', (req, res) => {[m
[31m-    res.render('login.views.ejs');[m
[32m+[m[32m    let sessionData = sessionFlash.getSessionData(req);[m
[32m+[m
[32m+[m[32m    if (!sessionData) {[m
[32m+[m[32m        sessionData = {[m
[32m+[m[32m            name: '',[m
[32m+[m[32m            email: '',[m
[32m+[m[32m            password: '',[m
[32m+[m[32m        }[m
[32m+[m[32m    } else {[m[41m [m
[32m+[m[32m        res.render('login.views.ejs', { inputData: sessionData });[m[41m [m
[32m+[m[32m    }[m
 });[m
 [m
 [m
[31m-[m
 router.post('/login', async (req, res) => {[m
     const user = new loginmodel([m
         req.body.email,[m
[36m@@ -18,28 +28,32 @@[m [mrouter.post('/login', async (req, res) => {[m
     // new loginmodel을 사용하면 loginmodel 클래스에서 this를 사용가능![m
 [m
     const existinguser = await user.matchuser();[m
[31m-    if (!existinguser) {[m
[31m-        console.log('user does not exist, signup first');[m
[31m-        res.redirect('/login');[m
[31m-        return;[m
[31m-    } // 아이디 확인[m
[31m-[m
     const passwordmatch = await user.matchpassword();[m
[31m-    if (!passwordmatch) {[m
[31m-        console.log('Incorrect password');[m
[32m+[m[32m    if (!passwordmatch || !existinguser) {[m
[32m+[m[32m        console.log('Login failed');[m
[32m+[m[32m        sessionFlash.flashDataToSession(req, {[m
[32m+[m[32m            errmessage: '아이디 또는 비밀번호가 일치하지 않습니다.',[m
[32m+[m[32m            email: req.body.email,[m
[32m+[m[32m            password: req.body.password[m
[32m+[m[32m        }, function () {[m
         res.redirect('/login');[m
         return;[m
[31m-    } // 비번 확인[m
[32m+[m[32m    })}; // 비번 확인[m
 [m
     function createUserSession (req, user, action) {[m
         req.session.uid = user._id.toString(); [m
         req.session.save(action); [m
     } // 유저의 세션을 만들어주는 함수이다. action은 세션을 만들고 뒤에 실행하는 함수[m
 [m
[31m-    createUserSession(req, existinguser, function(){});[m
[31m-    // 세션을 만들고 나서 콜백함수를 실행한다. [m
[31m-    [m
[31m-    res.redirect('/');[m
[32m+[m[32m    createUserSession(req, existinguser, function(err){[m
[32m+[m[32m        if (err) {[m
[32m+[m[32m            console.log(err);[m
[32m+[m[32m        } else {[m
[32m+[m[32m            res.redirect('/');[m
[32m+[m[32m        }[m
[32m+[m[32m    });[m
[32m+[m[32m    // 세션을 만들고 나서 콜백함수를 실행한다. 콜백함수는 세션을 만들고 나서 실행되는 함수![m
[32m+[m[32m    // 따라서 무조건 세션이 만들어지고 나서 redirect이 실행된다![m
 });[m
 [m
 [m
[1mdiff --git a/routes/logout.routes.js b/routes/logout.routes.js[m
[1mindex 89cadfc..941a561 100644[m
[1m--- a/routes/logout.routes.js[m
[1m+++ b/routes/logout.routes.js[m
[36m@@ -2,12 +2,14 @@[m [mconst express = require('express');[m
 const router = express.Router();[m
 [m
 router.post ('/logout', (req, res) => {[m
[31m-    function destroyUserSession (req) {[m
[31m-        req.session.uid = null;[m
[31m-    }[m
[31m-    [m
[31m-    destroyUserSession(req);[m
[31m-    res.redirect('/login');[m
[32m+[m[32m    req.session.destroy(function(err) {[m
[32m+[m[32m        // .destroy 라는 함수는 기본적으로 있기 때문에 바로 사용가능[m
[32m+[m[32m        if (err) {[m
[32m+[m[32m          console.log(err);[m
[32m+[m[32m        } else {[m
[32m+[m[32m          res.redirect('/login');[m
[32m+[m[32m        }[m
[32m+[m[32m    });[m
 });[m
 [m
 module.exports = router;[m
\ No newline at end of file[m
[1mdiff --git a/routes/signup.routes.js b/routes/signup.routes.js[m
[1mindex 145fd5a..a1523de 100644[m
[1m--- a/routes/signup.routes.js[m
[1m+++ b/routes/signup.routes.js[m
[36m@@ -1,11 +1,22 @@[m
 const express = require('express');[m
 const router = express.Router();[m
[32m+[m[32mconst { userDB } = require('../database/MongoDB');[m
 const signupmodel = require('../models/signup.model');[m
[31m-[m
[32m+[m[32mconst sessionFlash = require('../utils/session-flash');[m
 [m
 [m
 router.get('/signup', (req, res) => {[m
[31m-    res.render('signup.views.ejs');[m
[32m+[m[32m    let sessionData = sessionFlash.getSessionData(req);[m
[32m+[m
[32m+[m[32m    if (!sessionData) {[m
[32m+[m[32m        sessionData = {[m
[32m+[m[32m            name: '',[m
[32m+[m[32m            email: '',[m
[32m+[m[32m            password: '',[m
[32m+[m[32m        }[m
[32m+[m[32m    } else {[m[41m [m
[32m+[m[32m        res.render('signup.views.ejs', { inputData: sessionData });[m[41m [m
[32m+[m[32m    }[m
 });[m
 [m
 router.post('/signup', async (req, res) => {[m
[36m@@ -15,7 +26,42 @@[m [mrouter.post('/signup', async (req, res) => {[m
         req.body.password[m
     );[m
 [m
[31m-    await user.signup();[m
[32m+[m[32m    async function checkEmailExists(email) {[m
[32m+[m[32m        const user = await userDB.findOne({ email: email })[m
[32m+[m[32m        if (user) {[m
[32m+[m[32m            return false;[m
[32m+[m[32m        } else {[m
[32m+[m[32m            return true;[m
[32m+[m[32m        }[m
[32m+[m[32m    } // 이메일 중복 확인하는 함수[m
[32m+[m
[32m+[m[32m    const emailcheck = await checkEmailExists(req.body.email);[m
[32m+[m[32m    // 이메일 중복이면 false, 아니면 true[m
[32m+[m
[32m+[m[32m    if (!emailcheck) {[m
[32m+[m[32m        console.log('email already exists');[m
[32m+[m[32m        sessionFlash.flashDataToSession(req, {[m
[32m+[m[32m            errmessage: '이미 존재하는 이메일입니다.',[m
[32m+[m[32m            name: req.body.name,[m
[32m+[m[32m            email: req.body.email,[m
[32m+[m[32m            password: req.body.password[m
[32m+[m[32m            // 이메일 중복이면 세션에 메시지와 입력값을 저장[m
[32m+[m[32m        }, function () {[m
[32m+[m[32m            res.redirect('/signup');[m
[32m+[m[32m        })[m
[32m+[m[32m        return;[m
[32m+[m[32m        // 이메일 중복(false)이면 리다이렉트[m
[32m+[m[32m    } else {[m
[32m+[m[32m        try {[m
[32m+[m[32m            await user.signup();[m
[32m+[m[32m        } catch (err) {[m
[32m+[m[32m            console.log(err);[m
[32m+[m[32m            next(err);[m
[32m+[m[32m            return;[m
[32m+[m[32m        }[m
[32m+[m[32m        // 이메일 중복아니면(true) 회원가입 함수 실행[m
[32m+[m[32m    };[m
[32m+[m
 [m
     res.redirect('/login');[m
 });[m
[1mdiff --git a/views/login.views.ejs b/views/login.views.ejs[m
[1mindex 789f0a0..ff735ed 100644[m
[1m--- a/views/login.views.ejs[m
[1m+++ b/views/login.views.ejs[m
[36m@@ -10,7 +10,7 @@[m
             <input type="hidden" name="_csrf" value="<%= locals.csrfToken %>">[m
             <p>[m
                 <label for="email">Email</label>[m
[31m-                <input type="email" name="email" id="email" required>[m
[32m+[m[32m                <input type="email" name="email" id="email" value="<%= inputData.email %>" required>[m
             </p>[m
             <p>[m
                 <label for="password">Password</label>[m
[1mdiff --git a/views/signup.views.ejs b/views/signup.views.ejs[m
[1mindex 5dfd3c9..a245bef 100644[m
[1m--- a/views/signup.views.ejs[m
[1m+++ b/views/signup.views.ejs[m
[36m@@ -6,17 +6,24 @@[m
     <%- include('./shared/header') %>[m
     <main id="signup">[m
         <h1>Signup</h1>[m
[32m+[m[32m        <% if (inputData.errmessage) {%>[m
[32m+[m[32m            <section class="alert">[m
[32m+[m[32m                <h2>Email already exists</h2>[m
[32m+[m[32m                <p><%= inputData.errmessage %></p>[m
[32m+[m[32m            </section>[m
[32m+[m[32m        <% } %>[m
[32m+[m
         <form action="/signup" method="POST">[m
             <!-- 액션과 메서드 : 어디로 요청을 전송하고, 어떻게 전송하는가 -->[m
             <input type="hidden" name="_csrf" value="<%= locals.csrfToken %>">[m
             <!-- csrf 토큰을 전송 보안! -->[m
             <p>[m
                 <label for="name">Name</label>[m
[31m-                <input type="name" name="name" id="name" required>[m
[32m+[m[32m                <input type="name" name="name" id="name" value="<%= inputData.name %>" required>[m
             </p>[m
             <p>[m
                 <label for="email">Email</label>[m
[31m-                <input type="email" name="email" id="email" required>[m
[32m+[m[32m                <input type="email" name="email" id="email" value="<%= inputData.email %>" required>[m
             </p>[m
             <p>[m
                 <label for="password">Password</label>[m
