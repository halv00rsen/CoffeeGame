
import { coffee_color } from "../../constants";

class CoffeeDropGUI {

    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

  paint(ctx, rel) {
    ctx.beginPath();
    ctx.arc(this.x * rel.x, this.y * rel.y, 10 * rel.x * rel.y, 0 , 2*Math.PI);
    if (this.type.color) {
      ctx.fillStyle = this.type.color;
    } else {
      ctx.fillStyle = coffee_color;
    }
    ctx.fill();
  }

  toString() {
    return "x: " + this.x + ", y: " + this.y;
  }
}

export default CoffeeDropGUI;

