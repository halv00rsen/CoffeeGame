
import UserInput from "./UserInput";
import { logic_game_speed } from "./constants";

// import * as io from 'socket.io-client';
import io from "socket.io-client";

class Game {
  constructor(app, gui) {
    this.app = app;
    this.gui = gui;

    this.left_key = false;
    this.right_key = false;
    this.is_running = false;
    this.game_loaded = false;
    new UserInput(this);

    this.socket = io("http://localhost:3000");
    this.socket.on("connect", () => {
      console.log("connected.");
      console.log(this.socket.id);

    });
  }

  new_game() {
    console.log("New game");
    // this.pause();
    this.game_loaded = true;
    clearInterval(this.game_interval);
    this.is_running = false;
    this.game_init = true;
    this.app.new_game();
    this.start();
  }

  start () {
    if (this.is_running || !this.game_loaded) {
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
