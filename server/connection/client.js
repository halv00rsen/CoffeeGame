
const PlayerConnection = require("./PlayerConnection.js");


class Client {
    constructor(connection) {
        this.connection = connection;
        this.username = undefined;
        this.player_connection = undefined;

        console.log("Client connected: Client");
    }

    send_data() {
        const data = {};
        if (this.username) {
            data["logged_in"] = true;
            data["username"] = this.username;
        } else {
            data["logged_in"] = false;
        }

        if (this.player_connection) {
            let username;
            if (this.player_connection.player_one.username !== this.username) {
                username = this.player_connection.player_one.username;
            } else {
                username = this.player_connection.player_two.username;
            }
            data["opponent"] = username;
        }
        this.connection.emit("status", data);
    }

    send_game_data() {
        /**
         * {
         *  "sea_level": int (position),
         *  "drops": [drops],
         *  "can": int (position),
         *  "cup": int (position)
         * }
         */
    }

    send_msg(msg) {
        this.connection.emit("message", msg);
    }
}

module.exports = Client;
