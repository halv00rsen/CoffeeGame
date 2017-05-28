
import { logic_width as width, logic_height as height } from "../constants";

import CoffeeCup from "./CoffeeCup";
import CoffeePot from "./CoffeePot";
import CoffeeDrop from "./CoffeeDrop";
import CoffeeSea from "./CoffeeSea";

class ApplicationListener {
  constructor() {

  }

}

class Application {
	constructor(){
		this.listeners = [];
	}

	add_listener(listener) {
		this.listeners.push(listener);
	}

  new_game() {
    this.lowest_drop = undefined;
    this.coffee_cup = new CoffeeCup();
    this.coffee_pot = new CoffeePot();
    this.coffee_sea = new CoffeeSea();
    this.game_counter = 0;

    for (let l of this.listeners) {
      l.new_game(this);
    }
  }

  run(left, right) {
    // console.log("running kis");
    if (left) {
      this.coffee_cup.add_left();
    } else {
      this.coffee_cup.remove_left();
    }

    if (right) {
      this.coffee_cup.add_right();
    } else {
      this.coffee_cup.remove_right();
    }

    this.coffee_cup.move();
    this.coffee_pot.move();
    this.lowest_drop && this.lowest_drop.move_down();

    this.game_counter++;
    if (this.game_counter % 75 === 0) {
      const drop = new CoffeeDrop(this.coffee_pot.x);
      if (this.lowest_drop) {
        this.lowest_drop.set_child(drop);
      } else {
        this.lowest_drop = drop;
      }
      for (let l of this.listeners) {
        l.add_new_drop(drop);
      }
    }
  }
}

// module.exports = Application;

export default Application;
