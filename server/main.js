
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Game = require("./Game.js");

const connected_users = {}
const usernames = [];
const usernames_with_id = {}

const sockets = io.sockets;

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
  client.on("join", (username) => {
    if (usernames.indexOf(username) >= 0 || connected_users[client.id]) {
      client.emit("username_taken", "The username is taken.");
    } else {
      usernames.push(username);
      client.emit("login", {});
      connected_users[client.id] = username;
      usernames_with_id[username] = client.id;
      sockets.emit("usernames", usernames);
      hehe = new Game();
    }
  });

  client.on("create_game", (data) => {
    const invite_user = data.username;
    if (usernames_with_id[invite_user]) {
      const id = usernames_with_id[invite_user];
      for (let h in sockets.sockets) {
        if (h === id) {
          sockets.sockets[h].emit("get_invite");
          new Game().new_game(client, sockets.sockets[h]);
          break;
        }
      }
    }
  });

  client.on("usernames", () => {
    client.emit("usernames", usernames);
  });


  client.on("logout", () => {
    logout(client.id);
  });


  client.on('disconnect',() => {
    logout(client.id); 
  });

  client.emit("usernames", usernames);
});

http.listen(3000, "0.0.0.0", () => {
  console.log('listening on *:3000');
});

