
import { CoffeeDropListener } from "../../logic/CoffeeDrop";

import { coffee_color } from "../../constants";

class CoffeeDropGUI extends CoffeeDropListener {

  paint(ctx, rel) {
    ctx.beginPath();
    ctx.arc(this.x * rel.x, this.y * rel.y, 10 * rel.x * rel.y, 0 , 2*Math.PI);
    ctx.fillStyle = coffee_color;
    ctx.fill();
    if (this.child_drop) {
      this.child_drop.paint(ctx, rel);
    }
  }

  set_child(drop) {
    if (this.child_drop) {
      this.child_drop.set_child(drop);
    } else {
      this.child_drop = drop;
    }
  }

  toString() {
    return "x: " + this.x + ", y: " + this.y;
  }
}

export default CoffeeDropGUI;
