
import { CoffeeSeaListener } from "../../logic/CoffeeSea";

import { coffee_color, canvas_height, canvas_width } from "../../constants";

class CoffeeSeaGUI extends CoffeeSeaListener {
  constructor() {
   super();
  }

 paint(ctx, rel) {
    ctx.beginPath();
    ctx.fillStyle = coffee_color;
    ctx.fillRect(0, (canvas_height - this.y) * rel.y, canvas_width, canvas_height * rel.y);
  } 
}

export default CoffeeSeaGUI;
