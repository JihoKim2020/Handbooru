const express = require('express');
const router = express.Router();
const imageSchema = require('../models/image.model');
const path = require('path');
var fs = require('fs');
var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
    // upload 폴더에 이미지를 일단 저장한다.
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
    // 저장할 때 파일명을 지정한다.
});

var upload = multer({ storage: storage });


router.get ('/upload', (req, res) => {
    res.render('uploadimg.views.ejs');
});

router.post('/upload', upload.single("image"),(req, res) => {
    const obj = {
        imgdiscription: req.body.imgdiscription, 
        model: req.body.model, 
        extranetwork: req.body.extranetwork,
        img: {
            data: fs.readFileSync(path.join(__dirname, '..' , '/uploads/', req.file.filename)),
			contentType: 'image/png'
        }
    }

    imageSchema.create(obj)
    .then ((err, item) => {
        if (err) {
			console.log(err);
		}
		else {
			// item.save();
			res.redirect('/');
		}
    });
});

module.exports = router;
