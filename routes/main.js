const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');


router.get("/", (req, res) => {
    const title = "PixeS";
    res.render("index", { title: title }); // renders views/index.handlebars
});

router.get("/group", (req, res) => {
    res.render("chats/chat");
});

router.get("/groups/:id", (req, res) => {
    res.render("chats/group");
});

//Login User
router.get('/showLogin', (req, res) => {
    res.render('user/login')
})

//Register User
router.get('/showregister', (req, res) => {
    res.render('user/register');
})

//forgot password page
router.get('/showForgot', (req, res) => {
    res.render('user/forgot');
})

//user profile
router.get('/showProfile', (req, res) => {
    res.render('user/profile')
})

//video
// router.get('/video/listVideos',(req,res)=>{
// 	const title='video list';
// 	res.render('video/listVideos')
// })

router.get('/video/listVideos', (req, res) => {
    const title = 'video list';
    res.render('video/addVideo')
})

// router.get('/video/addVideo',(req,res)=>{
// 	const title='video list';
// 	res.render('video/addVideo')
// })
//Login User
router.get('/about', (req, res) => {
    const author = 'Robert Lim';
    alertMessage(res, 'success',
        'This is an important message', 'fas fa-sign-in-alt', true);
    alertMessage(res, 'danger',
        'Unauthorised access', 'fas fa-exclamation-circle', false);

    let success_msg = 'Success message';
    let error_msg = 'Error message using error_msg';

    let error = 'Error using error';

    let errors = [{ text: '1st error' },
        { text: '2nd error' },
        { text: '3rd error' }
    ]



    res.render('about', {
        author: author,
        success_msg: success_msg,
        error_msg: error_msg,
        errors: errors,
        error: error
    })
})

// Logout User
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;