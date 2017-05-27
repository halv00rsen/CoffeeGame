
const cup_fills = 2;


class CoffeeDrop {
  constructor(x) {
    this.y = 35;
    this.x = x;
    this.speed = 4;
    this.father_drop = undefined;
  }

  move_down() {
    this.y += this.speed;
    if (this.father_drop) {
      this.father_drop.move_down();
    }
  }

  update(ctx, rel) {
    ctx.beginPath();
    ctx.arc(this.x * rel.x, this.y * rel.y, 10 * rel.x * rel.y, 0 , 2*Math.PI);
    ctx.fillStyle = "brown";
    ctx.fill();
    if (this.father_drop) {
      this.father_drop.update(ctx, rel);
    }
  }

  set_child(child) {
    if (this.father_drop) {
      this.father_drop.set_child(child);
    } else {
      this.father_drop = child;
    }
  }

}


class Game {

  constructor() {
    this.canvas = document.getElementById("game");
    this.context = this.canvas.getContext("2d");
    this.canvas.height = 500;
    this.canvas.width = 500;
    // this.canvas.height = window.innerHeight;
    // this.canvas.width = window.innerWidth;
    this.start_counter = 0;
    this.height = 500;
    this.width = 500;
    this.left_key = false;
    this.right_key = false;
    this.is_running = false;
    this.blink_color = "black";
    window.addEventListener("keydown", e => {
      if (e.keyCode === 37) {
        this.left_key = true;
      } else if (e.keyCode === 39) {
        this.right_key = true;
      } else if (e.keyCode === 27) {
        this.pause();
      } else if (e.keyCode === 13 && !this.is_running) {
        this.start();
      } else if (e.keyCode === 78) {
        this.new_game();
      }
    });
    window.addEventListener("keyup", e => {
      if (e.keyCode === 37) {
        this.left_key = false;
      } else if (e.keyCode === 39) {
        this.right_key = false;
      }
    });
  }

  new_game() {
    this.pause();
    this.clear();
    this.is_running = false;
    this.game_init = true;
    this.cup = new CoffeeCup();
    this.pot = new CoffeePot();
    this.gameCounter = new GameCounter();
    this.sea = new CoffeeSea(this.width, this.height);
    this.counter = 0;
    this.lowest_drop = undefined;
    // this.drops = [];
    this.start();
  }

  start() {
    if (!this.game_init || this.start_counter != 0) {
      return;
    }
    this.start_counter = 4;
    const counter_func = () => {
      this.start_counter--;
      if (this.start_counter === 0) {
        return;
      }
      this.run();
      this.context.beginPath();
      this.context.font = "60px Georgia";
      this.context.fillStyle = "red";
      this.context.fillText("" + this.start_counter, this.canvas.width / 2 - 50, this.canvas.height / 2 - 50);
    }
    this.start_counter_interval = setInterval(() => {
      counter_func();
      if (this.start_counter === 0) {
        clearInterval(this.start_counter_interval);
        this.is_running = true;
        this.runInterval = setInterval(() => {
          this.run();
        }, 20);
      }

    }, 1000);
    counter_func();
  }

  run() {
    this.clear();
    // const rel = {
    //   x: this.width / this.canvas.width,
    //   y: this.height / this.canvas.height
    // }
    const rel = {
      x: this.canvas.width / this.width,
      y: this.canvas.height / this.height
    }
    this.context.fillStyle = "#c4daff";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.lowest_drop && this.lowest_drop.move_down();
    this.lowest_drop && this.lowest_drop.update(this.context, rel);
    // for (let i of this.drops) {
    //   i.move_down();
    //   i.update(this.context, rel);
    // }
    if (this.left_key) {
      this.cup.add_left();
    } else {
      this.cup.remove_left();
    }

    if (this.right_key) {
      this.cup.add_right();
    } else {
      this.cup.remove_right();
    }
    this.cup.move();

    if (this.cup.x <= 0 || this.cup.x >= this.width - this.cup.width) {
      this.gameCounter.total_fills += this.cup.has;
      this.cup.empty_it();
    }

    this.cup.update(this.context, rel);
    this.pot.move();
    this.pot.update(this.context, rel);
    this.counter++;
    if (this.counter % 50 === 0) {
      this.add_new_drop(this.pot.x);
      // this.drops.push(new CoffeeDrop(this.pot.x));
      this.counter = 0;
    }

    if (this.lowest_drop && this.lowest_drop.y > this.cup.y && this.lowest_drop.y < this.cup.y + 10) {
      // console.log(this.drops[0].y);
      const drop = this.lowest_drop;
      // const drop = this.drops[0];
      if (this.cup.x <= drop.x && !this.cup.is_full()) {
        if (drop.x - this.cup.x < this.cup.width) {
          this.gameCounter.hits++;
          this.lowest_drop = this.lowest_drop.father_drop;
          // this.drops.splice(0, 1);
          this.cup.add_coffe_tear();
        }
      }
    }
    if (this.lowest_drop && this.lowest_drop.y > this.sea.y_maks - this.sea.y) {
    // if (this.drops.length && this.drops[0].y > this.sea.y_maks - this.sea.y) {
      // this.drops.splice(0, 1);
      this.lowest_drop = this.lowest_drop.father_drop;
      this.gameCounter.misses++;
      this.sea.y += 10;
      this.cup.y -= 10;
    }
    this.gameCounter.update(this.context, rel);
    this.sea.update(this.context, rel);
    if (this.cup.is_full()) {
      if (this.counter % 15 == 0) {
        if (this.blink_color === "black") {
          this.blink_color = "blue";
        } else {
          this.blink_color = "black";
        }
      }
      this.context.fillStyle = this.blink_color;
      this.context.font = "30px Georgia";
      this.context.fillText("Empty cup!!", this.canvas.width / 2, this.canvas.height / 2);
    }
  }

  add_new_drop(x) {
    if (this.lowest_drop === undefined) {
      this.lowest_drop = new CoffeeDrop(x);
    } else {
      this.lowest_drop.set_child(new CoffeeDrop(x));
    }
  }

  pause() {
    if (!this.is_running) {
      return;
    }
    this.is_running = false;
    clearInterval(this.runInterval);
    clearInterval(this.start_counter_interval);
    this.start_counter = 0;
    this.context.beginPath();
    this.context.fillStyle = "rgba(255, 255, 255, 0.5)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

class CoffeeCup {
  constructor() {
    this.y = 450;
    this.x = 250;
    this.left_speed = 0;
    this.right_speed = 0;
    this.width = 50;
    this.height = 30;
    this.can_hold = cup_fills;
    this.has = 0;
  }

  is_full() {
    return this.has === this.can_hold;
  }


  add_coffe_tear() {
    if (this.has === this.can_hold) {
      return false;
    }
    this.has++;
    return true;
  }

  empty_it() {
    this.has = 0;
  }


  remove_right() {
    if (this.right_speed > 0) {
      this.right_speed -= 0.8;
    } else {
      this.right_speed = 0;
    }
  }

  remove_left() {
    if (this.left_speed > 0) {
      this.left_speed -= 0.8;
    } else {
      this.left_speed = 0;
    }
  }

  add_right() {
    if (this.right_speed < 12) {
      this.right_speed++;
    }
  }

  add_left() {
    if (this.left_speed < 12) {
      this.left_speed++;
    }
  }

  move() {
    this.x += this.right_speed - this.left_speed;
    if (this.x < 0) {
      this.x = 0;
      this.right_speed = this.left_speed;
      this.left_speed = 0;
    } else if (this.x + this.width > 500) {
      this.x = 500 - this.width;
      this.left_speed = this.right_speed;
      this.right_speed = 0;
    }
  }

  update(ctx, rel) {
    ctx.beginPath();
    ctx.fillStyle = "brown";
    ctx.fillRect(this.x * rel.x, (this.y + this.height / this.can_hold * (this.can_hold - this.has)), 
                 this.width * rel.x, (this.height - (this.height / this.can_hold * (this.can_hold - this.has))) * rel.y);
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeRect(this.x * rel.x, this.y * rel.y, this.width * rel.x, this.height * rel.y);
    // ctx.fillRect((this.x + 1) * rel.x, (this.y + 6* (5 - this.has) - 1) * rel.y, (this.width - 1) * rel.x, (this.height - 1) * rel.y);
    // ctx.fillRect(this.x, this.x + 30, this.y, this.y + 30);
  }
}


class GameCounter {
  constructor() {
    this.misses = 0;
    this.hits = 0;
    this.total_fills = 0;
  }

  update(ctx, rel) {
    ctx.beginPath();
    ctx.font = "20px Georgia";
    ctx.fillText("Hits: " + this.hits, 10 * rel.x, 20 * rel.y);
    ctx.fillText("Misses: " + this.misses, 10 * rel.x, 45 * rel.y);
    ctx.fillText("Total fills: " + Math.floor(this.total_fills / cup_fills), 10 * rel.x, 70 * rel.y);
  }

}


class CoffeePot {
  constructor() {
    this.x = 200;
    this.y = 10;
    this.move_to_x = 200;
    this.speed = 3;
  }

  move() {
    if (Math.abs(this.move_to_x - this.x) < 10) {
      let x = Math.floor((Math.random() * 470) + 1);
      while (Math.abs(x - this.x) < 50) {
        x = Math.floor((Math.random() * 470) + 1);
      }
      this.move_to_x = x;
    }
    if (this.move_to_x < this.x) {
      this.x -= this.speed;
    } else {
      this.x += this.speed;
    }
  }

  update(ctx, rel) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillRect(this.x * rel.x, this.y * rel.y, 30 * rel.x, 30 * rel.y);
  }

}


class CoffeeSea {
  constructor(x, y) {
    this.x = x;
    this.y = 10;
    this.y_maks = y;
  }

  update(ctx, rel) {
    ctx.beginPath();
    ctx.fillStyle = "brown";
    ctx.fillRect(0, (this.y_maks - this.y) * rel.y, this.x * rel.x, this.y_maks * rel.y);
  }
}

const game = new Game();

function update_width() {
  const e = document.getElementById("canvas-width");
  const width = e.options[e.selectedIndex].value;
  console.log(width);
  game.canvas.width = width;
}

// function start() {
//   game.start();
// }

// function pause() {
//   game.pause();
// }
