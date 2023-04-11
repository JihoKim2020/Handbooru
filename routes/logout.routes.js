const express = require('express');
const router = express.Router();

router.post ('/logout', (req, res) => {
    function destroyUserSession (req) {
        req.session.uid = null;
    }
    
    destroyUserSession(req);
    res.redirect('/login');
});

module.exports = router;