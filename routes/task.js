const express = require('express');
const {
    username
} = require('../config/db');
const Task = require('../models/Task');
// const User = require('../models/User');
const passport = require('passport')
const router = express.Router();

let errors = []
let success_msg = '';
router.route("/")
    .get(function (req, res) {
        res.render("task/tasks", {
            id: req.user.name
        });
    })

    .post(async function (req, res) {
        try {
            const {
                name,
                timestamp,
                description,
                priority,
                assignedTo,
                dateDue
            } = req.body
            const createdBy = req.user.id;
            await Task.create({
                name,
                timestamp,
                description,
                assigned: assignedTo,
                priority,
                createdBy,
                dateDue
            })
            const task = await Task.findOne({
                where: {
                    createdBy,
                    timestamp
                }
            })
            return res.json(task);
        } catch (err) {
            console.log(err);
            return res.status(400);
        }
    })
    .delete(async function (req, res) {
        try {
            const {
                id
            } = req.body;
            const userId = req.user.id;
            let currTask = await Task.findOne({
                where: {
                    id,
                    createdBy: userId
                }
            }).catch(e => {
                console.log(e.message)
            })
            if (!currTask) {
                console.log("Task not found!")
                return res.status(500);
            }
            currTask.destroy()
            return res.status(204);
        } catch (err) {
            console.log(err);
            return res.status(404);
        }
    })
    .put(async function (req, res) {
        console.log(req.body)
        try {
            const {
                taskId,
                name,
                timeEdited,
                description,
                priority,
                assignedTo,
                dateDue
            } = req.body;
            const userId = req.user.id;
            await Task.update({
                name,
                timeEdited,
                description,
                priority,
                assignedTo,
                dateDue
            }, {
                where: {
                    createdBy: userId,
                    id: taskId
                }
            });
            const task = await Task.findOne({where: {id: taskId, createdBy: userId}})
            return res.status(task);
        } catch (err) {
            console.log(err);
            return res.status(500);
        }
    })

router.route("/api/tasks/:id")
    .get(async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const createdBy = req.user.id;
            const task = await Task.findOne({
                where: {
                    id,
                    createdBy
                }
            })
            return res.json(task)
        } catch (err) {
            return res.status(404)
        }
    })

router.get("/api/tasks", async (req, res) => {
    const createdBy = req.user.id;
    try {
        const allTasks = await Task.findAll({
            where: {
                createdBy
            }
        })
        return res.json(allTasks)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            'error': 'Something went wrong'
        })
    }
})

module.exports = router