const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');

router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', {title: title}) // renders views/index.handlebars
});

router.get('/showlogin', (req, res) => {
	console.log('login flash');
	var error = req.flash('error');
	console.log(error);
	res.render('user/login', { error });
});

router.get('/showregister', (req, res) => {
	res.render('user/register');
});

router.get('/about', (req, res) => {
	const author = 'Denzel Washington'; 
	let success_msg = 'Success message'; 
	let error_msg = 'Error message using error_msg'; 
	let errors = [{text: 'error'},{text: 'error1'} ]
	alertMessage(res, 'success', 'This is an important message', 'fas fa-sign-in-alt', true); 
	alertMessage(res, 'danger', 'Unauthorised access', 'fas fa-exclamation-circle', false);

	res.render('about', { author, success_msg, error_msg, errors})
});


// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
