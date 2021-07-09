const express = require('express');
const socks = require("../helpers/socks");

const Group = require("../models/Group");
const User = require("../models/User");

const router = express.Router();

function initSocketClient(req)
{
  let userData = req.user.dataValues;
  socks.io.on("connection", (socket) => {
    let target = "public";
            
    socket.username = userData.name;
    socket.userID = userData.id;
    socket.target = target;
            
    //socket.emit("join", target);
  })
}

router.get("/", (req, res) => {
    if (socks.checkLoggedIn(req)) 
    {
      initSocketClient(req);
      res.render("chats/chat");
    }
    else
    {
      res.redirect("/showLogin");
    }
});

router.get("/user/:id", (req, res) => {
  let uid = req.params.id;
  if (socks.checkLoggedIn(req))
  {
    User.findOne({where: {id: uid}}).then((u) => {
      initSocketClient(req);
      res.render("chats/user", {uname: u.dataValues.name});
    });
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
          initSocketClient(req);
          res.render("chats/group", {gname: g.dataValues.name});
        });
    }
    else
    {
      res.redirect("/showLogin");
    }
});

module.exports.router = router;