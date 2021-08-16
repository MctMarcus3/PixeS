function getChannel(l) {
  let length = l.length;
  let defaultChannel = "public";

  if (length >= 4) {
    let t = l[2].toLowerCase();
    let i = [3];

    if (t == "user") return `${i}`;
    else return `${t}${i}`;
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

  socket.on("new_message", (data) => {
    feedback.html("");
    message.val("");

    chatroom.append(
      '<p class="message">' + data.username + ": " + data.message + "</p>"
    );
  });

  message.bind("keypress", () => {
    socket.emit("typing");
  });

  socket.on("groups", (data) => {
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
    socket.emit("get_grp", data);
  });

  $("#addGroup").click(() => {
    let gname = $("#addGroupInput").val();

    let data = { name: gname };

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
    socket.emit("get_grp");
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
