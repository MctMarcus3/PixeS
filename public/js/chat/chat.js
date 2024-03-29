let clients = {};

function getChannel(l) {
  let length = l.length;
  let defaultChannel = "public";

  if (length >= 4) {
    let t = l[2].toLowerCase();
    let i = l[3];

    return `${t}${i}`;
  } else {
    return defaultChannel;
  }
}

$(function () {
  let socket = io.connect("http://localhost:5000");
  let lmaowtf = window.location.pathname.split("/");

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
    socket.emit("new_message", { channel: channel, message: message.val() });
  });

  socket.on("updateusers", (data) => {
    let sockID = data.i;
    let userID = data.u;

    clients[userID] = sockID;
  });

  socket.on("new_message", (data) => {
    feedback.html("");
    message.val("");

    let time_sent = new Date().toLocaleString();

    if (data.from == socket.id) {
      chatroom.append(
        `<div class="chatcontainer darker">
          <p class="message"><b>${data.username}</b> : ${data.message}</p>
          <span class="time">${time_sent}</span>
          <button class="btn"><i class="fa fa-trash"></i></button>
        </div>`
      );
    } else {
      chatroom.append(
        `<div class="chatcontainer">
          <p class="message"><b>${data.username}</b> : ${data.message}</p>
          <span class="time">${time_sent}</span>
        </div>`
      );
    }
  });

  socket.on("history", (data) => {
    let messages = data.m;
    let users = data.u;

    for (let i = 0; i < messages.length; i++) {
      let msg = messages[i];

      let mid = msg.id;
      let userid = msg.userid;
      let text = msg.text;
      let hidden = msg.hidden;

      if (!hidden) {
        let time_sent = new Date(msg.time_sent).toLocaleString();

        if (users[userid] != null) {
          let u = users[userid];
          let uname = u.name;

          if (clients[userid] == socket.id) {
            chatroom.append(`<div class="chatcontainer darker" id=${mid}>
                <p class="message"><b>${uname}</b> : ${text}</p>
                <span class="time">${time_sent}</span>
                <form action="/chat/delete" method="post">
                  <input type="hidden" value="${channel}_${mid}" name="d" />
                  <button class="btn" type="submit" name="delete"><i class="fa fa-trash"></i></input>
                </form>
              </div>`);
          } else {
            chatroom.append(`<div class="chatcontainer" id=${mid}>
                <p class="message"><b>${uname}</b> : ${text}</p>
                <span class="time">${time_sent}</span>
              </div>`);
          }
        } else {
          chatroom.append(
            '<p style="color: red" class="message"><b>Error loading message(s).</b></p>'
          );
        }
      }
    }
  });

  message.bind("keypress", () => {
    socket.emit("typing");
  });

  socket.on("groups", (data) => {
    console.log(data);
    $("#group-bind").html("");
    data.forEach((e) => {
      let del = $(`<i class="fas fa-times ml-2"></i>`);
      let elem = $(
        `<a class="nav-link collapsed" href="/groups/${e.id}">
                            <i class="fas fa-fw fa-users"></i>
                            <span>` +
          e.name +
          `</span>
                        </a>`
      ).append(del);
      del.on("click", (ee) => {
        ee.preventDefault();
        socket.emit("del_grp", e.id);
      });
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
          e.name +
          " notes" +
          `</span>
                        </a>`
      );
      $("#group-note-bind").append(elem);
    });
  });

  $("#addUser").click(() => {
    let data = prompt("Enter username");
    socket.emit("get_grps", data);
  });

  $("#addGroup").click(() => {
    let gname = $("#addGroupInput").val();

    let data = { name: gname, authusername: $("#usernameauth").text() };

    socket.emit("new_grp", data);
    socket.emit("get_grps");
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
    if (err.message == "ERR-ZL0ND") {
      console.log("Not logged in!");
    }
  });

  socket.on("update_users", (data) => {
    for (let i = 0; i < data.length; i++) {
      console.log(data[i]);
    }
  });

  socket.on("new_user", (user) => {
    this.users.push(user);
  });

  socket.on("alert", (data) => {
    alert(data);
  });

  setInterval(() => {
    socket.emit("get_grps", { authusername: $("#usernameauth").text() });
    socket.emit("update_users", getChannel(lmaowtf));
  }, 500);

  $(document).ready(function () {
    $("#add").on("click", () => {
      let username = $("#addFriendsId").val();
      var arr = window.location.pathname.split("/");
      socket.emit("add_member", {
        username: username,
        grp_id: arr[arr.length - 1],
      });
    });

    var arr = window.location.pathname.split("/");
    socket.emit("get_members", { grp_id: arr[arr.length - 1] });

    socket.on("list_members", (list) => {
      console.log(list);

      $(".members").html(``);
      $(".members").append(
        `<div class="col-12 p-2" style="font-weight: 900; color: black;">Admin: </div>`
      );
      $(".members").append(
        $(`<div class="col-12 p-2 item">${list.admin}</div>`)
      );
      $(".members").append(
        `<div class="col-12 p-2" style="font-weight: 900; color: black;">Members: </div>`
      );
      list.members.forEach((e) => {
        $(".members").append(
          $(`<div class="col-12 p-2 item">${e}</div>`)
            .append(`<i class="fas fa-times ml-2"></i>`)
            .on("click", () => {
              socket.emit("delete_member", {
                username: e,
                grp_id: arr[arr.length - 1],
              });
            })
        );
      });
    });
  });
});
