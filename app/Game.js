
import UserInput from "./UserInput";

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
    console.log("hehe");
    clearInterval(this.game_interval);
    this.gui.is_pause = false;
    this.game_interval = setInterval(() => {
      this.run();
    }, 20);
  }


  pause() {
    clearInterval(this.game_interval);
    this.gui.activate_pause_screen();
  }


  clear() {

  }


  run() {
    this.app.run(this.left_key, this.right_key);
    this.gui.paint_graphics();
  }
}

export default Game;
