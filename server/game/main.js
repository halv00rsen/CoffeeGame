
const cup = require("./CoffeeCup.js");
const CoffeeCup = cup["CoffeeCup"];
const CoffeeCupListener = cup["Listener"];
const CoffeeDrop = require("./CoffeeDrop.js");

class Game  {
    constructor(connection) {
        this.interval = undefined;
        this.connection = connection;
        this.counter = 0;

        this.left = false;
        this.right = false;
        this.pot_left = false;
        this.pot_right = false;
        this.pot_shoot = false;
        this.cup_shoot = false;
        this.pot_shooting_time = 0;
        this.cup_shooting_time = 0;
        this.shots = [];
        this.coffee_cup = new CoffeeCup();
        this.coffee_pot = new CoffeeCup();
    }

    set_cup_data(data) {
        this.left = data["left"];
        this.right = data["right"];
        this.cup_shoot = data["space"];
    }

    set_pot_data(data) {
        this.pot_left = data["left"];
        this.pot_right = data["right"];
        this.pot_shoot = data["space"];
    }

    set_direction(left, right) {
        this.left = left;
        this.right = right;
    }

    set_pot_direction(left, right) {
        this.pot_left = left;
        this.pot_right = right;
    }

    run() {
        this.interval = setInterval(() => {
            this.counter++;
            const last_x = this.coffee_cup.x;
            const last_pot_x = this.coffee_pot.x;

            if (this.left) {
                this.coffee_cup.add_left();
            } else {
                this.coffee_cup.remove_left();
            }
        
            if (this.right) {
                this.coffee_cup.add_right();
            } else {
                this.coffee_cup.remove_right();
            }
            this.coffee_cup.move();

            if (this.pot_left) {
                this.coffee_pot.add_left();
            } else {
                this.coffee_pot.remove_left();
            }

            if (this.pot_right) {
                this.coffee_pot.add_right();
            } else {
                this.coffee_pot.remove_right();
            }
            this.coffee_pot.move();

            if (this.pot_shoot && (this.counter - this.pot_shooting_time) > 100) {
                const drop = new CoffeeDrop(this.coffee_pot.x, true);
                this.shots.push(drop);
                this.pot_shooting_time = this.counter;
            }

            if (this.cup_shoot && (this.counter - this.cup_shooting_time ) > 100) {
                const drop = new CoffeeDrop(this.coffee_cup.x, false);
                this.shots.push(drop);
                this.cup_shooting_time = this.counter;
            }

            // this.connection.send_msg("Counter: " + this.counter);
            if (this.coffee_cup.x !== last_x || this.coffee_pot.x !== last_pot_x || true) {
                const drops = [];
                const new_shots = [];
                for (let i in this.shots) {
                    const drop = this.shots[i];
                    if (drop.y <= 500 && drop.y >= 0) {
                        drop.move();
                        drops.push({
                            "x": drop.x,
                            "y": drop.y,
                            "down": drop.down
                        });
                        new_shots.push(drop);
                    }
                }
                this.shots = new_shots;
                const data = {
                    "cup_pos": this.coffee_cup.x,
                    "pot_pos": this.coffee_pot.x,
                    "shots": drops
                };
    
                this.connection.send_game_data(data);
            }
        }, 4);
    }

    teardown() {
        clearInterval(this.interval);
        this.connection = undefined;
    }
}

module.exports = Game;
