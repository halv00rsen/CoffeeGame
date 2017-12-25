
import UserInput from "./UserInput";
import { logic_game_speed } from "./constants";

import { _ } from "underscore";

// import * as io from 'socket.io-client';
import io from "socket.io-client";
// import { clearInterval } from "timers";

class Game {
  constructor(app, gui) {
    this.app = app;
    this.gui = gui;

    this.left_key = false;
    this.right_key = false;
    this.space_key = false;
    this.is_running = false;
    this.game_loaded = false;
    this.last_used_data = {};
    new UserInput(this);

    // this.socket = io("http://localhost:3000");
    this.socket = io("http://192.168.1.91:3000");
    // this.socket = io("http://172.20.10.2:3000");
    this.socket.on("connect", () => {
      console.log("connected.");
      console.log(this.socket.id);

    });
  }

  set_data(data) {
    this.app.set_server_data(data);
  }

  teardown() {
    clearInterval(this.logic_interval);
    clearInterval(this.gui_interval);
    this.is_running = false;
  }

  new_game() {
    console.log("New game");
    // this.pause();
    this.game_loaded = true;
    clearInterval(this.game_interval);
    this.is_running = false;
    this.game_init = true;
    this.app.new_game();
    this.gui.active = true;
    this.gui.resize_canvas();
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
    // this.logic_interval = setInterval(() => {
    //   this.app.run(this.left_key, this.right_key);
    // }, 20 / logic_game_speed);
    this.logic_interval = setInterval(() => {
      const data = {
        "left": this.left_key,
        "right": this.right_key,
        "space": this.space_key
      }
      if (!_.isEqual(data, this.last_used_data)) {
        // console.log("equal");
        this.socket.emit("game_data", data);
        this.last_used_data = data;
      }
    }, 50);
    this.gui_interval = setInterval(() => {
      this.gui.paint_graphics();
    }, 10);
  }


  pause() {
    if (!this.is_running) {
      return;
    }
    // this.is_running = false;
    // clearInterval(this.gui_interval);
    // clearInterval(this.logic_interval);
    // this.gui.activate_pause_screen();
  }


  clear() {

  }


  // run() {
  //   this.app.run(this.left_key, this.right_key);
  //   this.gui.paint_graphics();
  // }
}

export default Game;
