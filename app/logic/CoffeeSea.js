
import { logic_width, logic_height } from "../constants";

class CoffeeSea {
  constructor() {
    this.y = 10;
    this.width = logic_width;
    this.y_maks = logic_height;
    this.listeners = [];
  }

  add_listener(l) {
    this.listeners.push(l);  
  }

  move_up() {
    this.y += 10;
    for (let l of this.listeners) {
      l.update_y(this.y);
    }
  }

}

export default CoffeeSea;
