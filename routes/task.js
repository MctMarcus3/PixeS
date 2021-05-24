const express = require('express');
const Task = require('../models/Task');
// const model = require('../models/Task');
const router = express.Router();

let errors = []
let success_msg = '';
router.get("/", (req, res) => {
    res.render("task/tasks");
})
router.get("/1", (req, res) => {
    res.render("task/tasks1");
})
router.post('/', (req, res) => {
    console.log(req.body)
    let title = req.body.title;
    let timestamp = Date.now()
    res.send({
        title,
        timestamp
    });
    Task.create({
        title,
        timestamp
    })
    .catch(err => console.log(err))
});

router.post('/tasks', (req, res) => {
    let title = req.body.title;
    let timestamp = Date.now()
    res.send({
        title,
        timestamp
    });
    Task.create({
        title,
        timestamp
    })
    .catch(err => console.log(err))
});

module.exports = router