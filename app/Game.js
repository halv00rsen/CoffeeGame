
import UserInput from "./UserInput";
import { logic_game_speed } from "./constants";

class Game {
  constructor(app, gui) {
    this.app = app;
    this.gui = gui;

    this.left_key = false;
    this.right_key = false;
    this.is_running = false;
    new UserInput(this);
  }

  new_game() {
    console.log("New game");
    // this.pause();
    clearInterval(this.game_interval);
    this.is_running = false;
    this.game_init = true;
    this.app.new_game();
    this.start();
  }

  start () {
    if (this.is_running) {
      return;
    }
    clearInterval(this.logic_interval);
    clearInterval(this.gui_interval);
    this.is_running = true;
    this.gui.is_pause = false;
    console.log("GameRun: " + (20 / logic_game_speed));
    this.logic_interval = setInterval(() => {
      this.app.run(this.left_key, this.right_key);
    }, 20 / logic_game_speed);
    this.gui_interval = setInterval(() => {
      this.gui.paint_graphics();
    }, 5);
  }


  pause() {
    if (!this.is_running) {
      return;
    }
    this.is_running = false;
    clearInterval(this.gui_interval);
    clearInterval(this.logic_interval);
    this.gui.activate_pause_screen();
  }


  clear() {

  }


  // run() {
  //   this.app.run(this.left_key, this.right_key);
  //   this.gui.paint_graphics();
  // }
}

export default Game;
