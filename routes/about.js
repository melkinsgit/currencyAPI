var express = require('express');
var router = express.Router();

router.get('/', about);

function about (req, res) {
	console.log('Request about page')
	res.render('about');
}

module.exports = router;