
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require("express-session");
const sharedsession = require("express-socket.io-session");

const Game = require("./Game.js");

const connected_users = {}
const usernames = [];
const usernames_with_id = {}

const sockets = io.sockets;

const sess = {
  secret: "long-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {}
}

app.use(session(sess));

if (app.get("env") === "production") {
  sess.cookie.secure = true;
}

// io.use(sharedsession(sess, {
//   autoSave: true
// }));
// io.use(sharedsession(sess));

const logout = (id) => {
  const username = connected_users[id];
  const ind = usernames.indexOf(username);
  usernames.splice(ind, 1);
  delete connected_users[id];
  delete usernames_with_id[username];
  sockets.emit("usernames", usernames);
}

let hehe;

io.on('connection', (client) => {
  // console.log(client.session);
  // console.log("heisann kis.");
  console.log("Client connected...");
  client.on("join", (username) => {
    if (usernames.indexOf(username) >= 0 || connected_users[client.id]) {
      client.emit("username_taken", "The username is taken.");
    } else {
      usernames.push(username);
      client.emit("login", {});
      connected_users[client.id] = username;
      usernames_with_id[username] = client.id;
      sockets.emit("usernames", usernames);
      client.logged_in = true;
      hehe = new Game();
      console.log(username + " has logged in");
    }
  });

  client.on("create_game", (data) => {
    if (!client.logged_in) {
      client.emit("message", "You have not logged in.");
      return;
    }
    const invite_user = data.username;
    if (usernames_with_id[invite_user]) {
      const id = usernames_with_id[invite_user];
      if (id === client.id) {
        client.emit("message", "Cannot invite your self.");
        return;
      }
      for (let h in sockets.sockets) {
        if (h === id) {
          sockets.sockets[h].emit("get_invite");
          client.current_game = new Game();
          //new Game().new_game(client, sockets.sockets[h]);
          break;
        }
      }
      console.log(client.current_game);
    }
  });

  client.on("usernames", () => {
    client.emit("usernames", usernames);
  });


  client.on("logout", () => {
    logout(client.id);
    client.logged_in = false;
  });


  client.on("disconnect",() => {
    logout(client.id); 
    client.logged_in = false;
    console.log("Now has disconnected");
  });

  client.emit("usernames", usernames);
});

http.listen(3000, "0.0.0.0", () => {
  console.log('listening on *:3000');
});

