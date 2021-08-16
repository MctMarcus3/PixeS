function getChannel(l)
{
  let length = l.length;
  let defaultChannel = "public";

  if (length >= 4)
  {
    let t = l[2].toLowerCase();
    let i = [3];

    if (t == "user") return `${i}`;
    else return `${t}${i}`;
  }
  else
  {
    return defaultChannel;
  }
}

$(function () {
  let socket = io.connect("http://localhost:5000");
  let lmaowtf = window.location.pathname.split('/');

  let message = $("#message");
  //let username = $("#username");
  let send_message = $("#send_message");
  //let send_username = $("#send_username");
  let chatroom = $("#chatroom");
  let feedback = $("#feedback");

  let channel = getChannel(lmaowtf);

  socket.emit("join", channel);
  socket.target = channel;

  send_message.click(function () {
    socket.emit("new_message", {channel: channel, message: message.val() });
  });

  socket.on("new_message", (data) => {
    feedback.html("");
    message.val("");

    chatroom.append(
      '<p class="message">' + data.username + ": " + data.message + "</p>"
    );
  });

  socket.on("history", (data) => {
    let messages = data.m;
    let users = data.u;
    
    for (let i = 0; i < messages.length; i++)
    {
      let msg = messages[i];
      let mid = msg.id;
      let userid = msg.userid;
      let text = msg.text;

      console.log(users[1]);

      if (users[userid] != null)
      {
        let u = users[userid];
        let uname = u.name;

        chatroom.append(
          `<p class="message" name=${mid}>` + uname + ": " + text + "</p>"
        );
      }
      else
      {
        chatroom.append(
          "<p class=\"message\">Error loading message(s).</p>"
        );
      }
    }
  })

  message.bind("keypress", () => {
    socket.emit("typing");
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
  socket.on("groups", (data) => {
    $("#group-note-bind").html("");
    data.forEach((e) => { 
      let elem = $(
        `<a class="nav-link collapsed" href="/notes/${e.id}">
                            <i class="fas fa-fw fa-users"></i>
                            <span>` +
          e.name + " notes" +
          `</span>
                        </a>`
      );
      $("#group-note-bind").append(elem);
    });
  });

  $("#addUser").click(() => {
    let data = prompt("Enter username");
    socket.emit("get_grp", data);
  });

  $("#addGroup").click(() => {
    let gname = prompt("Enter group name");

    let data = {name: gname};

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

  socket.on("update_users", (data) => {
    for (let i = 0; i < data.length; i++)
    {
      console.log(data[i]);
    }
  });

  socket.on("new_user", (user) => {
    this.users.push(user);
  });

  setInterval(() => {
    socket.emit("get_grp");
    socket.emit("update_users", getChannel(lmaowtf));
  }, 2000);
}); 