
const logic_width = 500;
const logic_height = 500;
const coffee_pot_width = 30;
const logic_game_speed = 4;
  
class CoffeePot {
    constructor() {
      this.x = logic_width / 2;
      this.y = 10;
      this.move_to_x = logic_width / 2;
      this.speed = 3 / logic_game_speed;
      console.log("CoffeePotSpeed: " + this.speed);
      this.listeners = [];
    }
  
    add_listener(l) {
      this.listeners.push(l);
    }
  
    move() {
      if (Math.abs(this.move_to_x - this.x) < 10) {
        let x = Math.floor((Math.random() * (logic_width - coffee_pot_width)) + 1);
        while (Math.abs(x - this.x) < 50) {
          x = Math.floor((Math.random() * (logic_width - coffee_pot_width)) + 1);
        }
        this.move_to_x = x;
      }
      if (this.move_to_x < this.x) {
        this.x -= this.speed;
      } else {
        this.x += this.speed;
      }
      for (let l of this.listeners) {
        l.update_vertical(this.x);
      }
    }
}
  
module.exports = CoffeePot;
  
