
import { 
  logic_width, 
  logic_height, 
  logic_raising 
} from "../constants";


export class CoffeeSeaListener {

  constructor() {
    this.y = 20;
  }

  update_y(y) {
    this.y = y;
  }
}


class CoffeeSea {
  constructor() {
    this.y = 20;
    this.width = logic_width;
    this.y_maks = logic_height;
    this.listeners = [];
  }

  add_listener(l) {
    if (l instanceof CoffeeSeaListener) {
      this.listeners.push(l);
    } else {
      throw l.constructor.name + " is not an instance of CoffeeSeaListener.";
    }
  }

  raise() {
    this.y += logic_raising;
    for (let l of this.listeners) {
      l.update_y(this.y);
    }
  }

}

export default CoffeeSea;
