const io = require('socket.io')();
const Group = require("../models/Group");
const Chat = require("../models/Chat");

module.exports.checkLoggedIn = function(req)
{
    return req.user != null;
}

module.exports.io = io;

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
  
    /**socket.on("change_username", (data) => {
      socket.username = data.username;
    });**/

    socket.on("join_channel", (data) => {
      console.log(data);
    });
  
    socket.on("new_message", (data) => {
        let target = data.channel;
        console.log(data);
        let uid = (socket.userID == null) ? -1 : socket.userID;
        console.log(uid);

        Chat.create({channelid: target, userid: uid, text: data.message});
        io.emit("new_message", {
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