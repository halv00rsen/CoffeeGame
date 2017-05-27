
import { logic_width as width, logic_height as height } from "../constants";

import CoffeeCup from "./CoffeeCup";

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
  }
}

// module.exports = Application;

export default Application;
