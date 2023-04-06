const express = require('express');
const app = express();
const path = require('path');


app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 
// 뷰 엔진으로 ejs를 쓰며 뷰 폴더를 /views로 지정한다.


const Routes = require('./routes/routes');
app.use(Routes);


app.listen(3000);
// 3000번 포트를 사용하겠다는 의미이다.