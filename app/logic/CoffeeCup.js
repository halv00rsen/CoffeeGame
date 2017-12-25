
import { 
  cup_fills, 
  logic_width as board_width, 
  logic_height as board_height,
  coffee_cup_width as width,
  coffee_cup_height as height,
  logic_game_speed,
  logic_raising
} from "../constants";

const start_x = board_width / 2;
const start_y = board_height - 2 * height;

export class CoffeeCupListener {

  constructor() {
    this.x = start_x;
    this.y = start_y;
  }


  update_position(x) {
    this.x = x;
  }

  update_fill_cup(tears) {
    this.tears = tears;
  }
}

class CoffeeCup {
  constructor() {
    this.y = board_height - 2 * height;
    this.x = board_width / 2;
    this.left_speed = 0;
    this.right_speed = 0;
    this.has = 0;
    this.listeners = [];
  }

  add_listener(l) {
    this.listeners.push(l);
  }

  is_full() {
    return this.has === cup_fills;
  }


  add_coffe_tear() {
    if (this.has === cup_fills) {
      return false;
    }
    this.has++;
    for (let l of this.listeners) {
      l.update_fill_cup(this.has);
    }
    return true;
  }

  empty_it() {
    this.has = 0;
    this.have_hit_wall = false;
    for (let l of this.listeners) {
      l.update_fill_cup(0);
    }
  }


  remove_right() {
    if (this.right_speed > 0) {
      this.right_speed -= (1 / logic_game_speed ** 2);
    } else {
      this.right_speed = 0;
    }
  }

  remove_left() {
    if (this.left_speed > 0) {
      this.left_speed -= (1 / logic_game_speed ** 2);
    } else {
      this.left_speed = 0;
    }
  }

  add_right() {
    if (this.right_speed < (12 / logic_game_speed)) {
      this.right_speed += (1 / logic_game_speed ** 2);
    }
  }

  add_left() {
    if (this.left_speed < (12 / logic_game_speed)) {
      this.left_speed += (1 / logic_game_speed ** 2);
    }
  }

  set_data(pos) {
    this.x = pos;
    for (let l of this.listeners) {
      l.update_position(this.x);
    }
  }

  move() {
    this.x += this.right_speed - this.left_speed;
    if (this.x < 0) {
      this.x = 0;
      this.right_speed = this.left_speed;
      this.left_speed = 0;
      this.have_hit_wall = this.has !== 0;
    } else if (this.x + width > board_width) {
      this.x = board_width - width;
      this.left_speed = this.right_speed;
      this.right_speed = 0;
      this.have_hit_wall = this.has !== 0;
    }
    // console.log(last_x + "   " + x + "  " + this.listeners.length);
    if (this.right_speed !== this.left_speed) {
      for (let l of this.listeners) {
        l.update_position(this.x);
      }
    }
  }

  raise() {
    this.y -= logic_raising;
    for (let l of this.listeners) {
      l.y = this.y;
    }
  }
}

export default CoffeeCup;
