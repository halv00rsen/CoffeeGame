
import { 
  canvas_width as width, 
  canvas_height as height,
  logic_width,
  logic_height
} from "../constants";

import CoffeeCupGUI from "./elements/CoffeeCupGUI";
import CoffeePotGUI from "./elements/CoffeePotGUI";
import CoffeeDropGUI from "./elements/CoffeeDropGUI";
import CoffeeSeaGUI from "./elements/CoffeeSeaGUI";

import InformationText from "./InformationText";
import PauseScreen from "./PauseScreen";

import { ApplicationListener } from "../logic/Application";

class Main extends ApplicationListener {

	constructor(canvas) {
    super();
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

    this.context.fillStyle = "#c4daff";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.coffee_cup.paint(this.context, rel);
    this.coffee_pot.paint(this.context, rel);
    this.coffee_sea.paint(this.context, rel);
    this.info_text.paint(this.context, rel);
    this.lowest_drop && this.lowest_drop.paint(this.context, rel);
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
    this.lowest_drop = undefined;
    this.coffee_cup = new CoffeeCupGUI();
    this.coffee_pot = new CoffeePotGUI();
    this.coffee_sea = new CoffeeSeaGUI();
    this.info_text = new InformationText();
    logic.coffee_cup.add_listener(this.coffee_cup);
    logic.coffee_pot.add_listener(this.coffee_pot);
    logic.coffee_sea.add_listener(this.coffee_sea);
  }


  update_information_text(misses, fills) {
    this.info_text.set_data(misses, fills);
  }


  add_new_drop(drop) {
    const gui_drop = new CoffeeDropGUI(drop.x);
    drop.add_listener(gui_drop);
    if (this.lowest_drop) {
      this.lowest_drop.set_child(gui_drop);
    } else {
      this.lowest_drop = gui_drop;
    }
  }

  remove_lowest_tear() {
    this.lowest_drop = this.lowest_drop.child_drop;
  }

}

export default Main;
