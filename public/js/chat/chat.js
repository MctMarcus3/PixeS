$(function () {
  let socket = io.connect("http://localhost:5000");

  let message = $("#message");
  let username = $("#username");
  let send_message = $("#send_message");
  let send_username = $("#send_username");
  let chatroom = $("#chatroom");
  let feedback = $("#feedback");

  send_message.click(function () {
    socket.emit("new_message", { message: message.val() });
  });

  socket.on("new_message", (data) => {
    feedback.html("");
    message.val("");
    chatroom.append(
      '<p class="message">' + data.username + ": " + data.message + "</p>"
    );
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
      var elem = $(
        `<a class="nav-link collapsed" href="#">
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
    var data = prompt("Enter username");
    socket.emit("get_grp", data);
  });

  $("#addGroup").click(() => {
    var data = prompt("Enter group id");
    socket.emit("new_grp", data);
    socket.emit("get_grp");
  });

  setInterval(() => {
    socket.emit("get_grp");
  }, 100);
});
