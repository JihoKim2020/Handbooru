const express = require('express');
const router = express.Router();

router.post ('/logout', (req, res) => {
    req.session.destroy(function(err) {
        // .destroy 라는 함수는 기본적으로 있기 때문에 바로 사용가능
        if (err) {
          console.log(err);
        } else {
          res.redirect('/login');
        }
    });
});

module.exports = router;