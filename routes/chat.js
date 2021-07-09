const express = require('express');
const socks = require("../helpers/socks");

const Group = require("../models/Group");

const router = express.Router();

router.get("/", (req, res) => {
    if (socks.checkLoggedIn(req)) 
    {
        let userData = req.user.dataValues;
        socks.io.on("connection", (socket) => {
            let target = "public";
            
            socket.username = userData.name;
            socket.userID = userData.id;
            socket.target = null;
            
            socket.emit("join_channel", target);
        })

        res.render("chats/chat");
    }
    else
    {
      res.redirect("/showLogin");
    }
});

router.get("/group/:id", (req, res) => {
    let gid = req.params.id;
    if (socks.checkLoggedIn(req)) 
    {
        Group.findOne({where: {id: gid}}).then((g) => {
          let channel = `group${gid}`;
          socks.io.on("connection", (socket) => {
            socket.emit("join_channel", channel);
            socket.target = channel;
          });
          res.render("chats/group", {gname: g.dataValues.name});
        });
    }
    else
    {
      res.redirect("/showLogin");
    }
});

module.exports.router = router;