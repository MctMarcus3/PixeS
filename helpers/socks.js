const io = require('socket.io')();
const Group = require("../models/Group");
const Chat = require("../models/Chat");

module.exports.io = io;

module.exports.checkLoggedIn = function(req)
{
  return req.user != null;
}

module.exports.setServer = function(s) {
    if (s) 
    {
        io.attach(s);
    }
    else
    {
        throw new Error("Server is not initialized.");
    }
}

io.use((socket, next) => {
    let id = socket.id;
    if (!id)
    {
        return next(new Error("ERR-ZL0ND"));
    }
    socket.id = id;
    next();
});

io.on("connection", (socket) => {
    const users = [];
    console.log("LOG: [EVENT=connection] New client connected.");

    socket.on('disconnect', function() {
        console.log("LOG: [EVENT=disconnect] A client has disconnected.");
    });

    for (let [id, socket] of io.of("/").sockets)
    {
      users.push({
        socketID: id,
        userID: socket.userid,
        username: socket.username
      });
    }
  
    socket.on("join", (channel) => {
      //console.log(channel);
      let messages = [];
      Chat.findAll({where: {channelid: channel}}).then((c) => {
        c.forEach((d) => {
          messages.push(d.dataValues);
        });
        //console.log(messages);
        socket.join(channel);
      })
    });

    socket.on("typing", (data) => {
      socket.emit("typing", data);
    })
  
    socket.on("new_message", (data) => {
        let target = data.channel;
        let uid = (socket.userID == null) ? -1 : socket.userID;

        Chat.create({channelid: target, userid: uid, text: data.message});
        io.in(target).emit("new_message", {
            message: data.message,
            username: socket.username,
            target: target
        });
    });
  
    socket.on("get_grp", (data) => {
      var res = [];
      Group.findAll().then((e) => {
        e.forEach((d) => {
          res.push(d.dataValues);
        });
        io.sockets.emit("groups", res);
      });
    });
  
    socket.on("new_grp", (data) => {
      Group.create({id: data.id, name: data.name, grp_id: "111" });
    });
});