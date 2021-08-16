const io = require("socket.io")();
const Group = require("../models/Group");
const Chat = require("../models/Chat");

module.exports.io = io;

module.exports.checkLoggedIn = function (req) {
  return req.user != null;
};

module.exports.setServer = function (s) {
  if (s) {
    io.attach(s);
  } else {
    throw new Error("Server is not initialized.");
  }
};

io.use((socket, next) => {
  let id = socket.id;
  if (!id) {
    return next(new Error("ERR-ZL0ND"));
  }
  socket.id = id;
  next();
});

io.on("connection", (socket) => {
  console.log("LOG: [EVENT=connection] New client connected.");

  socket.on("disconnect", function () {
    console.log("LOG: [EVENT=disconnect] A client has disconnected.");
  });

  socket.on("join", (channel) => {
    //console.log(channel);
    let messages = [];
    Chat.findAll({ where: { channelid: channel } }).then((c) => {
      c.forEach((d) => {
        messages.push(d.dataValues);
      });
      //console.log(messages);
      socket.join(channel);
    });
  });

  socket.on("typing", (data) => {
    socket.emit("typing", data);
  });

  socket.on("new_message", (data) => {
    let target = data.channel;
    let uid = socket.userID == null ? -1 : socket.userID;

    Chat.create({ channelid: target, userid: uid, text: data.message });
    io.in(target).emit("new_message", {
      message: data.message,
      username: socket.username,
      target: target,
    });
  });

  socket.on("get_grp", (data) => {
    let res = [];
    Group.findAll().then((e) => {
      e.forEach((d) => {
        res.push(d.dataValues);
      });
      io.sockets.emit("groups", res);
    });
  });

  socket.on("get_members", (rcv) => {
    console.log("add");
    Group.findAll({ where: { id: rcv.grp_id } }).then((e) => {
      var data;
      try {
        data = JSON.parse(e[0].dataValues["members"]);
      } catch (e) {}
      if (!data) data = [];
      io.sockets.emit("list_members", {
        members: data,
        admin: e[0].dataValues["admin"],
      });
    });
  });

  socket.on("del_grp", (rcv) => {
    Group.destroy({ where: { id: rcv } }).then((e) => {});
  });

  socket.on("delete_member", (rcv) => {
    Group.findAll({ where: { id: rcv.grp_id } }).then((e) => {
      var data;
      try {
        data = JSON.parse(e[0].dataValues["members"]);
      } catch (e) {}
      if (!data) data = [];
      data = data.filter((item) => item !== rcv.username);
      console.log(data);

      Group.update(
        { members: JSON.stringify(data) },
        { where: { id: rcv.grp_id } }
      )
        .then((result) => {
          io.sockets.emit("list_members", {
            members: data,
            admin: e[0].dataValues["admin"],
          });
        })
        .catch((err) => {});
    });
  });

  socket.on("add_member", (rcv) => {
    Group.findAll({ where: { id: rcv.grp_id } }).then((e) => {
      var data;
      try {
        data = JSON.parse(e[0].dataValues["members"]);
      } catch (e) {}
      if (!data) data = [];

      for (var i in data) {
        if (data[i] == rcv.username) {
          io.sockets.emit("alert", "User can't be duplicated");
          return;
        }
      }

      data.push(rcv.username);
      Group.update(
        { members: JSON.stringify(data) },
        { where: { id: rcv.grp_id } }
      )
        .then((result) => {
          io.sockets.emit("list_members", {
            members: data,
            admin: e[0].dataValues["admin"],
          });
        })
        .catch((err) => {});
    });
  });

  socket.on("update_users", (data) => {
    let res = [];
    let rooms = io.of("/").adapter.rooms;
    let roomNo = 0;

    if (data != null) {
      let connectedSockets = rooms.get(data);

      if (connectedSockets != null) {
        let socketArr = Array.from(connectedSockets);

        for (let i = 0; i < socketArr.length; i++) {
          let s0 = socketArr[i];
          let s1 = io.sockets.sockets;

          if (s1.has(s0)) {
            let s = s1.get(s0);
            let userData = { UID: s.userID, username: s.username };

            roomNo = s.adapter.rooms.length;

            res.push(userData);
          }
        }
      }

      let d = { res, roomNo };

      io.sockets.in(data).emit("update_users", d);
    }
  });

  socket.on("new_grp", (data) => {
    Group.create({ id: data.id, name: data.name, grp_id: "111" });
  });
});
