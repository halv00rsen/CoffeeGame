
// const Application = require("./logic/main.js");

import Application from "./logic/Application";
import Main from "./GUI/Main";
import Game from "./Game";

import $ from "jquery";

const app = new Application();
const gui = new Main(document.getElementById("game"));

app.add_listener(gui);
const game = new Game(app, gui);

let is_logged_in = false;

$("#join-btn").click((e) => {
  if (is_logged_in) {
    game.socket.emit("logout");
    is_logged_in = false;
    $("#join-btn").html("Login");
    $("#inp-username").show();
    return;
  }
  const username = $("#inp-username").val();  
  game.socket.emit("join", username);
  $("#inp-username").val("");
});

$("#game-btn").click((e) => {
  const username = prompt("username");
  game.socket.emit("create_game", {
    username: username
  });
});

game.socket.on("login", (data) => {
  is_logged_in = true;
  $("#join-btn").html("Logout");
  $("#inp-username").hide();
});

game.socket.on("usernames", (usernames) => {
  $("#usernames").empty();
  for (let username of usernames) {
    $("#usernames").append("<li>" + username + "</li>");
  }
});

game.socket.on("get_invite", (data) => {
  console.log("Got invite.");
  console.log(data);
});


game.socket.on("play", (data) => {
  console.log(data);
});


game.socket.on("username_taken", (msg) => {
  console.log(msg);
});
