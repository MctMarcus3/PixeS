const express = require("express");
const socks = require("../helpers/socks");

const Group = require("../models/Group");
const User = require("../models/User");
const Chat = require("../models/Chat");

const router = express.Router();

function initSocketClient(req, id) {
  let userData = req.user.dataValues;
  socks.io.on("connection", (socket) => {
    socket.username = userData.name;
    socket.userID = userData.id;
    socket.data = userData;

    socket.emit("updateusers", {i: socket.id, u: userData.id})
    //socket.emit("join", target);
  });
}

router.get("/", (req, res) => {
  if (socks.checkLoggedIn(req)) {
    initSocketClient(req);
    res.render("chats/chat");
  } else {
    res.redirect("/showLogin");
  }
});

router.post("/delete", (req, res) => {
  let body = req.body;
  let d = body.d.split("_");
  let c = d[0];
  let i = d[1];

  Chat.findOne({
    where: {
      channelid: c,
      id: i
    }
  }).then((c) => {
    console.log(c);

    if (c.dataValues.hidden != true)
    {
      c.update({
        hidden: true
      })
    }

    res.redirect("/chat");
  })
  //console.log(req.body);
});

router.get("/user/:id", (req, res) => {
  let uid = req.params.id;
  if (socks.checkLoggedIn(req)) {
    User.findOne({ where: { id: uid } }).then((u) => {
      initSocketClient(req);
      res.render("chats/user", { uname: u.dataValues.name });
    });
  } else {
    res.redirect("/showLogin");
  }
});

router.get("/groups/:id", (req, res) => {
  let gid = req.params.id;
  if (socks.checkLoggedIn(req)) {
    Group.findOne({ where: { id: gid } }).then((g) => {
      initSocketClient(req);
      console.log(g);
      res.render("chats/group", { gname: g.dataValues.name });
    });
  } else {
    res.redirect("/showLogin");
  }
});

module.exports.router = router;
