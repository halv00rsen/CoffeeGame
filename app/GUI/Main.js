
import { 
  canvas_width as width, 
  canvas_height as height,
  logic_width,
  logic_height
} from "../constants";

import { types } from "../logic/CoffeeDrop";

import CoffeeCupGUI from "./elements/CoffeeCupGUI";
import CoffeePotGUI from "./elements/CoffeePotGUI";
import CoffeeDropGUI from "./elements/NewCoffeeDropGUI";
import CoffeeSeaGUI from "./elements/CoffeeSeaGUI";

import InformationText from "./InformationText";
import PauseScreen from "./PauseScreen";

import { ApplicationListener } from "../logic/Application";

class Main extends ApplicationListener {

	constructor(canvas) {
    super();
		// canvas.height = height;
    // canvas.width = width;
    // const win_height = window.innerHeight - 50;
    // const win_width = window.innerWidth - 50;

    // resize_canvas();
    // console.log(canvas.height + "  " + canvas.width);
    this.active = false;

    window.addEventListener("resize", this.resize_canvas, false);
    canvas.width = 0;
    canvas.height = 0;
    // console.log(win_height + "  " + win_width);
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

  resize_canvas() {
    const win_height = window.innerHeight - 50;
    const win_width = window.innerWidth - 50; 
    this.canvas.height = Math.min(win_height, win_width);
    this.canvas.width = Math.min(win_height, win_width);
    this.paint_graphics();
  }


  paint_graphics() {

    if (!this.active) {
      return;
    }

    this.clear();

    const rel = this.get_relative_size();

    this.context.fillStyle = "#c4daff";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.coffee_cup.paint(this.context, rel);
    this.coffee_pot.paint(this.context, rel);
    this.coffee_sea.paint(this.context, rel);
    for (let shot of this.new_shots) {
      shot.paint(this.context, rel);
    }

    this.info_text.paint(this.context, rel);
    // this.lowest_drop && this.lowest_drop.paint(this.context, rel);
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
    this.new_shots = [];
    this.coffee_cup = new CoffeeCupGUI();
    this.coffee_pot = new CoffeePotGUI();
    this.coffee_sea = new CoffeeSeaGUI();
    this.info_text = new InformationText();
    logic.coffee_cup.add_listener(this.coffee_cup);
    logic.coffee_pot.add_listener(this.coffee_pot);
    logic.coffee_sea.add_listener(this.coffee_sea);
    this.active = true;
  }


  update_information_text(misses, fills) {
    this.info_text.set_data(misses, fills);
  }


  add_new_drop(drop) {
    const gui_drop = new CoffeeDropGUI(drop.x, drop.type);
    drop.add_listener(gui_drop);
    if (this.lowest_drop) {
      this.lowest_drop.set_child(gui_drop);
    } else {
      this.lowest_drop = gui_drop;
    }
  }

  set_shots(shots) {
    this.new_shots = [];
    for (let drop of shots) {
      let effect;
      if (drop["down"]) {
        effect = types["normal"];
      } else {
        effect = types["sick"];
      }
      const hehe = new CoffeeDropGUI(drop["x"], drop["y"], effect);
      this.new_shots.push(hehe);
    }
  }

  remove_lowest_tear() {
    this.lowest_drop = this.lowest_drop.child_drop;
  }

}

export default Main;
