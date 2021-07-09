$(function () {
  let socket = io.connect("http://localhost:5000");
  let lmaowtf = window.location.pathname.split('/');

  let message = $("#message");
  let username = $("#username");
  let send_message = $("#send_message");
  let send_username = $("#send_username");
  let chatroom = $("#chatroom");
  let feedback = $("#feedback");

  send_message.click(function () {
    let channelType = null;
    let channelID = null;

    let channel = "public";

    if (lmaowtf.length >= 3)
    {
      channelType = lmaowtf[2] || null;
      channelID = lmaowtf[3] || null;

      if (channelType != null && channelID != null)
      {
        channel = `${channelType.toLowerCase()}${channelID}`;
      }
    }

    socket.emit("new_message", {channel: channel, message: message.val() });
  });

  socket.on("new_message", (data) => {
    feedback.html("");
    message.val("");

    let currentChannel = null;
    let target = data.target;

    if (lmaowtf.length >= 3)
    {
      channelType = lmaowtf[2] || null;
      channelID = lmaowtf[3] || null;

      if (channelType != null && channelID != null)
      {
        currentChannel = `${channelType.toLowerCase()}${channelID}`;
      }
    }
    else if (lmaowtf.length >= 2)
    {
      if (lmaowtf[1].toLowerCase() == "chat")
      {
        currentChannel = "public";
      }
    }

    if (target == currentChannel)
    {
      chatroom.append(
        '<p class="message">' + data.username + ": " + data.message + "</p>"
      );
    }
    /**if (lmaowtf.length >= 3)
    {
      channelType = lmaowtf[2] || null;
      channelID = lmaowtf[3] || null;
    }

    if (channelType == null && channelID == null)
    {
      if (data.target == null)
      {
        chatroom.append(
          '<p class="message">' + data.username + ": " + data.message + "</p>"
        );
      }
    }
    else if (data.target == `${channelType.toLowerCase()}${channelID}`)
    {
      chatroom.append(
        '<p class="message">' + data.username + ": " + data.message + "</p>"
      );
    }**/
  });

  send_username.click(function () {
    socket.emit("change_username", { username: username.val() });
  });

  message.bind("keypress", () => {
    socket.emit("typing");
  });

  socket.on("typing", (data) => {
    feedback.html(
      "<p><i>" + data.username + " is typing a message..." + "</i></p>"
    );
  });

  socket.on("groups", (data) => {
    $("#group-bind").html("");
    data.forEach((e) => {
      let elem = $(
        `<a class="nav-link collapsed" href="/chat/group/${e.id}">
                            <i class="fas fa-fw fa-users"></i>
                            <span>` +
          e.name +
          `</span>
                        </a>`
      );
      $("#group-bind").append(elem);
    });
  });

  $("#addUser").click(() => {
    let data = prompt("Enter username");
    socket.emit("get_grp", data);
  });

  $("#addGroup").click(() => {
    let gid = prompt("Enter group id");
    let gname = prompt("Enter group name");

    let data = {name: gname, id:id};

    socket.emit("new_grp", data);
    socket.emit("get_grp");
  });

  socket.on("users", (users) => {
    users.forEach((user) => {
      user.self = user.userID === socket.id;
    });

    this.users = users.sort((a, b) => {
      if (a.self) return -1;
      if (b.self) return 1;
      if (a.username < b.username) return -1;
      return a.username > b.username ? 1 : 0;
    });
  });

  socket.on("connect_error", (err) => {
    if (err.message == "ERR-ZL0ND")
    {
      console.log("Not logged in!");
    }
  });

  socket.on("new_user", (user) => {
    this.users.push(user);
  });

  setInterval(() => {
    socket.emit("get_grp");
  }, 2000);
}); 