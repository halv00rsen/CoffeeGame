
const Game = require("../game/main.js");

class PlayerConnection {
    constructor(player_one, player_two) {
        this.player_one = player_one;
        this.player_two = player_two;
        this.counter = 0;
        this.send_msg("Connection between " + player_one.username + " and " + player_two.username); 
        this.game = new Game(this);
    }

    send_msg(msg) {
        this.player_one.connection.emit("message", msg);
        this.player_two.connection.emit("message", msg);
    }

    init_game() {
        this.player_one.connection.emit("init_game");
        this.player_two.connection.emit("init_game");
    }

    send_game_data(data) {
        this.player_one.connection.emit("set_game_data", data);
        this.player_two.connection.emit("set_game_data", data);
    }

    teardown(user) {
        this.send_msg(user.username + " has disconnected.");
        this.player_one.player_connection = undefined;
        this.player_two.player_connection = undefined;
        this.player_one.send_data();
        this.player_two.send_data();
        this.game.teardown();
        this.game = undefined;
    }

    is_valid() {
        return (this.player_one && this.player_two);
    }
}

module.exports = PlayerConnection;
