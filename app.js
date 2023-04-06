const express = require('express');
const app = express();
// 기본적으로 express를 사용하기 위해서는 위와 같이 express를 require하고, express()를 호출해야 한다.


const path = require('path');
// path는 node.js에서 기본적으로 제공하는 모듈이다. path는 파일의 경로를 다루는 모듈이다.


const {client, userDB, connectDB}= require('./database/MongoDB');
connectDB();
// MongoDB에 연결한다.


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// HTML의 form 태그를 사용할 때, body-parser를 사용하지 않아도 req.body를 사용할 수 있으며, JSON 형식의 데이터를 받을 수 있다.


app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 
// 뷰 엔진으로 ejs를 쓰며 뷰 폴더를 /views로 지정한다.


const expressSession = require('express-session');
const createSessionConfig = require('./config/session');
app.use(expressSession(createSessionConfig()));
// session을 사용하기위한 준비, session을 사용하기 위해서는 express-session을 사용해야 한다.


const csrf = require('csurf');
app.use(csrf());
// CSRF 공격을 방지하기 위해 csurf를 사용한다. 보안!


const addCsrfTokenmiddleware = require('./middlewares/csrf-token');
app.use(addCsrfTokenmiddleware);
// csrf-token.js를 사용한다. app.use(csurf())를 사용하고 나서 사용해야함


const signupRoutes = require('./routes/signup.routes');
app.use(signupRoutes);
// signup 라우터를 사용하겠다는 의미.

const loginRoutes = require('./routes/login.routes');
app.use(loginRoutes);
// login 라우터를 사용하겠다는 의미.


const errorHandlermiddleware = require('./middlewares/error-handler');
app.use(errorHandlermiddleware);
// error-handler.js를 사용하겠다는 의미.


app.listen(3000);
// 3000번 포트를 사용하겠다는 의미이다.