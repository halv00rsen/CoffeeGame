
import { 
  logic_width as width, 
  logic_height as height,
  logic_game_speed,
  coffee_cup_width,
  cup_empty_num
} from "../constants";

import CoffeeCup from "./CoffeeCup";
import CoffeePot from "./CoffeePot";
import CoffeeDrop from "./CoffeeDrop";
import CoffeeSea from "./CoffeeSea";

export class ApplicationListener {
  constructor() {

  }

  remove_lowest_tear() {
    throw "You need to override the function 'remove_lowest_tear' in ApplicationListener.";
  }

  update_information_text(misses, fills) {
    throw "You need to override the function 'update_information_text' in ApplicationListener.";
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
    this.misses = 0;
    this.fills = 0;

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
    if (this.game_counter % (75 * logic_game_speed) === 0) {
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

    //if (this.coffee_cup.x <= 0 || this.coffee_cup.x >= this.width - coffee_cup_width) {
    if (this.coffee_cup.have_hit_wall) {
      //this.gameCounter.total_fills += this.coffee_cup.has;
      this.fills += this.coffee_cup.has; 
      this.coffee_cup.empty_it();
      for (let l of this.listeners) {
        l.update_information_text(this.misses, this.fills);
      }
    }

    if (this.lowest_drop && this.lowest_drop.y > this.coffee_cup.y && this.lowest_drop.y < this.coffee_cup.y + 10) {
      const drop = this.lowest_drop;
      // const drop = this.drops[0];
      if (this.coffee_cup.x <= drop.x && !this.coffee_cup.is_full()) {
        if (drop.x - this.coffee_cup.x < coffee_cup_width) {
          //this.gameCounter.hits++;
          this.lowest_drop = drop.child_drop;
          // this.drops.splice(0, 1);
          this.coffee_cup.add_coffe_tear();
          for (let l of this.listeners) {
            l.remove_lowest_tear();
          }
        }
      }
    }

    if (this.lowest_drop && this.lowest_drop.y > this.coffee_sea.y_maks - this.coffee_sea.y) {
      this.lowest_drop = this.lowest_drop.child_drop;
      this.coffee_cup.raise();
      this.coffee_sea.raise();
      this.misses++;
      for (let l of this.listeners) {
        l.update_information_text(this.misses, this.fills);
      }
      
      for (let l of this.listeners) {
        l.remove_lowest_tear();
      }
    }
  }
}

// module.exports = Application;

export default Application;
