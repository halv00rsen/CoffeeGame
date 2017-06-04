
import { logic_game_speed } from "../constants";

const start_y = 35;

export class CoffeeDropListener {
  constructor(x, type) {
    this.y = start_y;
    this.x = x;
    this.type = type;
    console.log(type +  "  " + x );
  }

  update_y_position(y) {
    this.y = y;
  }
}


class CoffeeDrop {
  constructor(x, type) {
    this.y = start_y;
    this.x = x;
    this.speed = 3 / logic_game_speed;
    console.log("CoffeeDropSpeed: " + this.speed);
    this.child_drop = undefined;
    this.listeners = [];
    this.type = type;
  }

  add_listener(l) {
    if (l instanceof CoffeeDropListener) {
      this.listeners.push(l);
    } else {
      throw "The listener needs to be a 'CoffeeDropListener' to be added to CoffeeDrop.";
    }
  }

  move_down() {
    this.y += this.speed;
    if (this.child_drop) {
      this.child_drop.move_down();
    }
    for (let l of this.listeners) {
      l.update_y_position(this.y);
    }
  }


  set_child(child) {
    if (this.child_drop) {
      this.child_drop.set_child(child);
    } else {
      this.child_drop = child;
    }
  }
}

export default CoffeeDrop;

export const types = {
  "normal": {
    "effect": "none"
  },
  "sick": {
    "effect": "bad",
    "color": "green",
    "desc": "will empty your cup"
  },
  "savesea": {
    "effect": "helping",
    "color": "blue",
    "desc": "will lower the sea"
  },
  "emptycup": {
    "effect": "helping",
    "color": "white",
    "desc": "will empty the cup to the right or left"
  },
  "dobbel_speed": {
    "effect": "bad",
    "color": "dont now",
    "desc": "dobble rate of tears/ or speed on cup/pot"
  },
  "lower_speed": {
    "effect": "bad",
    "color": "hehe",
    "desc": "lower the speed on pot (or tears?good)"
  }
}
