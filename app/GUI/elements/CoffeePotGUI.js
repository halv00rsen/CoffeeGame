
import { logic_width, logic_height, coffee_pot_width } from "../../constants";


class CoffeePotGUI {

  constructor() {
    this.x = logic_width / 2;
    this.y = 10;
    this.move_to_x = logic_width / 2;
  }

  update_vertical(x) {
    this.x = x;
  }

  paint(ctx, rel) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(this.x * rel.x, this.y * rel.y, 30 * rel.x, 30 * rel.y);
  }

}

export default CoffeePotGUI;
