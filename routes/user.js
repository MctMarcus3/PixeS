const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Friends = require('../models/Friends')
const alertMessage = require('../helpers/messenger');
const passport = require('passport');
var bcrypt = require('bcryptjs');
const flash = require("connect-flash");
const JWT_SECRET = 'some super secret...'
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const upload = require('../helpers/imageUpload');


function sendEmail(userId, email, token) {
    sgMail.setApiKey("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")

    const message = {
        to: email,
        from: "ourpixesmail@gmail.com",
        subject: "Change Account Password",
        text: "Pixes Password Link",
        html: `Please click on this link <br> <br> <a href="http://localhost:5000/user/reset-password/${userId}/${token}"> <strong>Change</strong></a> your password`
    };
    sgMail
        .send(message)
        .then((response) => {
            console.log(response[0].statusCode)
            console.log(response[0].headers)
        })
        .catch((error) => {
            console.error(error)
        });
}

router.get('/updateAccount/:id', (req, res) => {
    req.flash('id', req.params.id)
    res.render('user/update')
})
router.get('/changePw/:id', (req, res) => {
    req.flash('id', req.params.id)
    res.render('user/changePassword')
})

// User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    let errors = []
    let success_msg = '';
    let friendReq = null

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
                        name,
                        email
                    });
                } else {
                    // Create new user record
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(password, salt, function(err, hash) {
                            if (err) throw err;
                            User.create({ name, email, password: hash, friendReq })
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
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.redirect("/showLogin");

        req.logIn(user, function(err) {
            if (err) return next(err);

            return res.redirect("/chat");
        });
    })(req, res, next);
});

router.post('/findFriend/:id', (req, res) => {
    let existingid = req.params.id
    let thing = req.body
    let id = thing.id
    let errors = []
    let success_msg = '';
    var found = "false";
    console.log(id, existingid);

    User.findOne({ where: { id: id } })
        .then(user => {
            if (!user) {
                let msg = 'User not Found';
                console.log(msg)
                alertMessage(res, 'danger', msg, 'fas fa-exclamation-circle', false);
                res.redirect("/showProfile");
            } else {
                Friends.findOne({
                        where: {
                            [Op.or]: [{
                                    [Op.and]: [
                                        { friend: id },
                                        { friendsWith: existingid }
                                    ]
                                },
                                {
                                    [Op.and]: [
                                        { friend: existingid },
                                        { friendsWith: id }
                                    ]
                                }
                            ]
                        }
                    })
                    .then(friends => {
                        if (friends) {
                            let msg = 'Already friends';
                            console.log(msg)
                            alertMessage(res, 'danger', msg, 'fas fa-exclamation-circle', false);
                            res.json(friends)
                        } else {
                            let status = '1'
                            Friends.create({ friend: existingid, friendsWith: id, status })
                                .then(friends => {
                                    let msg = 'request sent';
                                    console.log(msg)
                                    alertMessage(res, 'success', msg, 'fas fa-sign-in-alt', true);
                                    // res.redirect('/showProfile');
                                    res.json(friends)
                                })
                        }
                    })
            }
        });
});

router.post('/addFriend', (req, res) => {
    let id = req.flash('id')
    let friend = req.body
    let friendId = friend.id
    let errors = []
    let success_msg = '';
    console.log(id, existingid[-1]);

    User.findOne({ where: { id: friendId } })
        .then(user => {
            if (!user) {
                let msg = 'User not Found';
                console.log(msg)
                alertMessage(res, 'danger', msg, 'fas fa-exclamation-circle', false);
            } else {
                // Create new friend record
                Friends.create({ id, friendId })
                    .then(user => {
                        let msg = "Request Sent";
                        alertMessage(res, 'success', msg, 'fas fa-sign-in-alt', true);
                        res.redirect('/showProfile');
                    })
                    .catch(err => console.log(err));
            }
        });

});

router.route('/getAllMyFriends/:id')
    .get(async(req, res) => {
        const id = req.params.id;
        const allFriends = await Friends.findAll({
            where: {
                [Op.or]: [{
                        friend: id,

                    },
                    {
                        friendsWith: id
                    }
                ]

            }
        }).then()
        return res.json(allFriends);
    });

router.post('/update', (req, res) => {
    let id = req.flash('id')
    let errors = []
    let success_msg = '';

    // Excercise 3
    let { name, email } = req.body;
    if (errors.length > 0) {
        res.render('user/update', {
            errors,
            name,
            email
        });
    } else {
        // update existing user record
        User.update({ name: name }, { where: { id: id } })
        User.update({ email: email }, { where: { id: id } })
            .then(user => {
                let msg = user.email + 'updated succesfully';
                alertMessage(res, 'success', msg, 'fas fa-sign-in-alt', true);
                res.redirect('/showProfile');
            })
            .catch(err => console.log(err));
    }
});

router.post('/changePw', (req, res) => {
    let id = req.flash('id')
    let errors = []
    let success_msg = '';

    let { extPassword, password, password2 } = req.body;
    if (password !== password2) {
        errors.push({ text: 'Passwords do not match' });
    }
    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('user/changePassword', {
            errors,
        });
    } else {
        User.findOne({ where: { id: id } })
            .then(user => {
                if (!user) {
                    return done(null, false, { message: 'No User Found' });
                }
                // Match password
                bcrypt.compare(extPassword, user.password, (err, isMatch) => {
                    console.log(extPassword, user.password)
                    if (err) throw err;
                    if (isMatch) {
                        console.log("Successfully");
                        bcrypt.genSalt(10, function(err, salt) {
                            bcrypt.hash(password, salt, function(err, hash) {
                                if (err) throw err;
                                User.update({ password: hash }, { where: { id: id } })
                                    .then(user => {
                                        let msg = user.email + 'password changed succesfully';
                                        alertMessage(res, 'success', msg, 'fas fa-sign-in-alt', true);
                                    })
                                    .catch(err => console.log(err));
                            })
                        });;
                    } else {
                        console.log("password error");
                    }
                })
            })
    }
});

router.post('/showForgot', (req, res, next) => {
    let { email } = req.body;
    console.log(email);
    User.findOne({ where: { email: email } })
        .then(user => {
            if (user) {
                const secret = JWT_SECRET + user.password
                const payload = {
                    email: user.email,
                    id: user.id
                }
                const token = jwt.sign(payload, secret, { expiresIn: "15m" })
                console.log(user.email)
                sendEmail(user.id, user.email, token)
                const link = `http://localhost:5000/user/reset-password/${user.id}/${token}`;
                console.log(link);
            } else {
                let msg = email + 'not registered';
                alertMessage(res, 'danger', msg, 'fas fa-exclamation-circle', false);
                console.log("not registered")
            }
        });
})

router.get('/reset-password/:id/:token', (req, res) => {
    const { id, token } = req.params;
    User.findOne({ where: { id: id } })
        .then(user => {
            if (user) {
                const secret = JWT_SECRET + user.password;
                try {
                    const payload = jwt.verify(token, secret);
                    res.render('user/reset-password', { email: user.email });
                } finally {}
            } else {
                let msg = 'Invalid ID';
                alertMessage(res, 'danger', msg, 'fas fa-exclamation-circle', false);
                console.log("Invalid ID");
            }
        });
})

router.post('/reset-password/:id/:token', (req, res, next) => {
    const { id, token } = req.params;
    let { password, password2 } = req.body;
    let errors = []
    User.findOne({ where: { id: id } })
        .then(user => {
            if (user) {
                if (password !== password2) {
                    errors.push({ text: 'Passwords do not match' });
                    console.log("passwords match")
                }
                if (password.length < 4) {
                    errors.push({ text: 'Password must be at least 4 characters' });
                    console.log("through")
                }
                if (errors.length > 0) {
                    res.render('user/register', {
                        errors,
                        password,
                        password2
                    });
                } else {
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(password, salt, function(err, hash) {
                            if (err) throw err;
                            User.update({ password: hash }, { where: { id: id } })
                                .then(user => {
                                    let msg = user.email + 'password changed succesfully';
                                    alertMessage(res, 'success', msg, 'fas fa-sign-in-alt', true);
                                    res.redirect('/showLogin');
                                })
                                .catch(err => console.log(err));
                        })
                    });
                }
            } else {
                let msg = 'Invalid ID';
                alertMessage(res, 'danger', msg, 'fas fa-exclamation-circle', false);
                console.log("Invalid ID");
            }
        });
})

router.get("/viewFriends/:id", (req, res) => {
    let id = req.params.id;
    Friends.findAll({
            where: {
                [Op.or]: [{
                        friend: id,

                    },
                    {
                        friendsWith: id
                    }
                ]

            }
        })
        .then((Friends) => {
            let friendList = []
            let friend = {}
            for (i in Friends) {
                console.log(Friends[i].dataValues.friend, Friends[i].dataValues.friendsWith, id)
                if (parseInt(Friends[i].dataValues.friend) === parseInt(id)) {
                    console.log("its me!")
                    User.findOne({
                            where: { id: Friends[i].dataValues.friendsWith }
                        })
                        .then((user) => {
                            console.log(user)
                            friendList.push({
                                id: user.dataValues.id,
                                name: user.dataValues.name,
                                exisitingId: id
                            })
                        })
                } else {
                    User.findOne({
                            where: { id: Friends[i].dataValues.friend }
                        })
                        .then((user) => {
                            friend[id] = user.dataValues.name
                            friendList.push({
                                id: user.dataValues.id,
                                name: user.dataValues.name,
                                exisitingId: id

                            })
                            console.log(friendList)
                        })
                }
            }
            res.render("user/showFriends", {
                friends: friendList,
            });

        })
        .catch((err) => console.log(err));
});

router.post("/deleteFriend", (res, req) => {
    console.log(req.body)
        //    let { friendid, id } = req.body
        //    console.log(friendid, id)
    Friends.destroy({
        where: {
            [Op.or]: [{
                    [Op.and]: [{
                            friend: id,

                        },
                        {
                            friendsWith: friendid
                        }
                    ]
                },
                {
                    [Op.and]: [{
                            friend: friendid,

                        },
                        {
                            friendsWith: id
                        }
                    ]
                }
            ]
        }
    })
})


module.exports = router;