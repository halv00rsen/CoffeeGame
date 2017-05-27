
import { 
  canvas_width as width, 
  canvas_height as height,
  logic_width,
  logic_height
} from "../constants";

import CoffeeCupGUI from "./elements/CoffeeCupGUI";
import PauseScreen from "./PauseScreen";

class Main {

	constructor(canvas) {
		canvas.height = height;
		canvas.width = width;
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.context.fillStyle = "black";
		this.context.strokeRect(0, 0, width, height);

    this.pause_screen = new PauseScreen();
	}


  get_relative_size() {
    return {
      x: this.canvas.width / logic_width,
      y: this.canvas.height / logic_height
    }
  }


  paint_graphics() {

    this.clear();

    const rel = this.get_relative_size();

    this.coffee_cup.paint(this.context, rel);
  }


  activate_pause_screen() {
    if (this.is_pause) {
      return;
    }
    console.log("Pauseskjerm kis");
    const rel = this.get_relative_size();
    this.is_pause = true;
    this.pause_screen.paint(this.context, rel);
  }


  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }


  new_game(logic) {
    console.log("new game gui");
    this.coffee_cup = new CoffeeCupGUI();
    logic.coffee_cup.add_listener(this.coffee_cup);
  }
}

export default Main;
