
// const Application = require("./logic/main.js");

import Application from "./logic/Application";
import Main from "./GUI/Main";
import Game from "./Game";

import $ from "jquery";

const canvas = document.getElementById("game");
const app = new Application();
const gui = new Main(canvas);

app.add_listener(gui);
const game = new Game(app, gui);

let is_logged_in = false;

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  let touches = e.changedTouches;
  const first_point = canvas.width / 3;
  const second_point = canvas.width - first_point;
  game.socket.emit("log", "First: " + first_point + " " + second_point); 
  for (let i = 0; i < touches.length; i++) {
    game.socket.emit("log", "First: " + touches[i].pageX + "  " + touches[i].clientX + "  " + touches[i].screenX)
    if (touches[i].pageX < first_point) {
      game.left_key = true;
    } else if (touches[i].pageX >= first_point && touches[i].pageX <= second_point) {
      game.space_key = true;
    } else if (touches[i].pageX > second_point) {
      game.right_key = true;
    }
  }
  game.socket.emit("log", "Start: " + game.left_key + " " + game.right_key + " " + game.space_key);
});

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  const touches = e.changedTouches;
  const first_point = canvas.width / 3;
  const second_point = canvas.width - first_point;
  game.socket.emit("log", first_point + " " + second_point); 
  for (let i = 0; i < touches.length; i++) {
    game.socket.emit("log", touches[i].pageX + "  " + touches[i].clientX + "  " + touches[i].screenX)
    if (touches[i].pageX < first_point) {
      game.left_key = false;
    } else if (touches[i].pageX >= first_point && touches[i].pageX <= second_point) {
      game.space_key = false;
    } else if (touches[i].pageX > second_point) {
      game.right_key = false;
    }
  }
  game.socket.emit("log", game.left_key + " " + game.right_key + " " + game.space_key);
});

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
  game.socket.emit("invite", {
    username: username
  });
});

$("#logout-btn").click((e) => {
  game.socket.emit("logout");
});

$("#quit-btn").click((e) => {
  game.socket.emit("quit_game");
});

$("#start-btn").click((e) => {
  game.socket.emit("start_game");
});

game.socket.on("login", (data) => {
  is_logged_in = true;
  // $("#join-btn").val("Logout");
  $("#inp-username").hide();
});

game.socket.on("usernames", (usernames) => {
  $("#usernames").empty();
  for (let username of usernames) {
    $("#usernames").append("<li>" + username + "</li>");
  }
});

game.socket.on("message", (msg) => {
  console.log(msg);
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

game.socket.on("set_game_data", (data) => {
  game.set_data(data);
});

game.socket.on("init_game", () => {
  console.log("Init game from server");
  $("#game").show();
  game.new_game();
});

game.socket.on("status", (data) => {
  console.log(data);
  if (data["logged_in"]) {
    $("#username").html(data["username"]);
  } else {
    $("#username").html("");
  }
  $("#logged-in").html(data["logged_in"]);
  $("#opponent").html(data["opponent"] ? data["opponent"] : "");
  if (!data["opponent"]) {
    game.teardown();
    $("#game").hide();
  }
});
