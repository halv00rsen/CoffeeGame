
import { CoffeeCupListener } from "../../logic/CoffeeCup";
import { 
  cup_fills, 
  logic_heigth,
  coffee_cup_width,
  coffee_cup_height,
  coffee_color
} from "../../constants";

class CoffeeCupGUI extends CoffeeCupListener {

  // constructor() {
  //   super();
  //   // this.y = logic_heigth - 2 * coffee_cup_height;
  // }

  paint(ctx, rel) {
    ctx.beginPath();
    ctx.fillStyle = coffee_color;
    ctx.fillRect(this.x * rel.x, (this.y + coffee_cup_height / cup_fills * (cup_fills - this.tears)), 
                 coffee_cup_width * rel.x, (coffee_cup_height - (coffee_cup_height / cup_fills * (cup_fills - this.tears))) * rel.y);
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeRect(this.x * rel.x, this.y * rel.y, coffee_cup_width * rel.x, coffee_cup_height * rel.y);
    
  }

}

export default CoffeeCupGUI;
