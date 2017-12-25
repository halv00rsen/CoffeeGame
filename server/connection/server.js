
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require("express-session");
const sharedsession = require("express-socket.io-session");

const sockets = io.sockets;

const sess = {
  secret: "long-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: {}
}

const Client = require("./client.js");
const PlayerConnection = require("./PlayerConnection.js");

app.use(session(sess));

if (app.get("env") === "production") {
    sess.cookie.secure = true;
}

const user_clients = [];
const usernames = [];
const game_connections = [];

io.on("connection", (conn) => {

    const client = new Client(conn); 
    user_clients.push(client);

    conn.on("join", (username) => {
        if (client.username !== undefined) {
            conn.emit("message", "Already logged in.");
            return;
        }
        console.log("Username: " + username);
        client.username = username;
        usernames.push(username);
        client.send_data();
        sockets.emit("usernames", usernames);
    });

    conn.on("invite", (data) => {
        if (client.username === undefined) {
            conn.emit("message", "Not logged in.");
            return;
        } else if (client.player_connection) {
            conn.emit("message", "You already have a connection.");
            return;
        }
        const username = data["username"];
        if (username === client.username) {
            client.send_msg("You cannot invite your self");
            return;
        }
        for (let i in user_clients) {
            const usr = user_clients[i];
            if (usr.username === username) {
                if (usr.player_connection !== undefined) {
                    conn.emit("message", username + " are already in a game.");
                    return;
                }
                const pl_conn = new PlayerConnection(client, usr);
                usr.player_connection = pl_conn;
                client.player_connection = pl_conn;
                client.send_data();
                usr.send_data();
                return;
            }
        }
        conn.emit("message", "Did not find the user: " + username);
    });

    conn.on("game_data", (data) => {
        if (client.player_connection) {
            if (client.player_connection.player_one === client) {
                // console.log(data);
                // client.player_connection.game.set_pot_direction(data["left"], data["right"]);
                client.player_connection.game.set_pot_data(data);
            } else {
                // client.player_connection.game.set_direction(data["left"], data["right"]);
                client.player_connection.game.set_cup_data(data);
            }
        }
    });

    conn.on("log", (data) => {
        console.log("LOG:");
        console.log(data);
    });

    conn.on("usernames", () => {
        client.emit("usernames", usernames);
    });

    conn.on("logout", () => {
        disconnect_client(client);
        client.send_data();
    });

    conn.on("quit_game", () => {
        if (client.player_connection) {
            client.player_connection.teardown(client);
        }
    });

    conn.on("start_game", () => {
        if (!client.player_connection) {
            client.send_msg("You have not found an opponent");
            return;
        }
        if (!client.player_connection.game.interval) {
            client.player_connection.init_game();
            client.player_connection.game.run();
        }
    });

    conn.on("disconnect", () => {
        disconnect_client(client); 
        const client_index = user_clients.indexOf(client);
        if (client_index > -1) {
            user_clients.splice(client_index, 1);
        }
    });

    conn.emit("usernames", usernames);
});

const disconnect_client = (user) => {
    if (user.player_connection) {
        user.player_connection.teardown(user);
    }
    const username_index = usernames.indexOf(user.username);
    if (username_index > -1) {
        usernames.splice(username_index, 1);
    }
    console.log("User removed: " + user.username);
    console.log(usernames);
    // console.log(user_clients);
    user.username = undefined;
    sockets.emit("usernames", usernames);
}

http.listen(3000, "0.0.0.0", () => {
    console.log('listening on *:3000');
});
