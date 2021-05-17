const express = require('express');
const router = express.Router();
const User = require('../models/User');
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
var bcrypt = require('bcryptjs');

// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    let errors = []
    let success_msg = '';

    // Excercise 3
    let { name, email, password, password2 } = req.body;
    if (password !== password2) {
        errors.push({ text: 'Passwords do not match' });
    }
    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('user/register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({ where: { email: email } })
            .then(user => {
                if (user) {
                    let msg = email + 'already registered';
                    alertMessage(res, 'danger', msg, 'fas fa-exclamation-circle', false);
                    res.render('user/register', {
                        name, email
                    });
                }
                else {
                    // Create new user record
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(password, salt, function (err, hash) {
                            if (err) throw err;
                            User.create({ name, email, password: hash })
                                .then(user => {
                                    let msg = user.email + 'registered succesfully';
                                    alertMessage(res, 'success', msg, 'fas fa-sign-in-alt', true);
                                    res.redirect('/showLogin');
                                })
                                .catch(err => console.log(err));
                        });
                    });
                }
            });
    }
});

// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/video/listVideos', // Route to /video/listVideos URL
        failureRedirect: '/showLogin', // Route to /login URL
        failureFlash: true
        /* Setting the failureFlash option to true instructs Passport to flash an error message using the
       message given by the strategy's verify callback, if any. When a failure occur passport passes the message
       object as error */
    })(req, res, next);
});

module.exports = router;

