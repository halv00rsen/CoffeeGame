
const start_y = 35;

export class CoffeeDropListener {
  constructor(x) {
    this.y = start_y;
    this.x = x;
  }

  update_y_position(y) {
    this.y = y;
  }
}


class CoffeeDrop {
  constructor(x) {
    this.y = start_y;
    this.x = x;
    this.speed = 3;
    this.child_drop = undefined;
    this.listeners = [];
  }

  add_listener(l) {
    this.listeners.push(l);
  }

  move_down() {
    this.y += this.speed;
    if (this.child_drop) {
      this.child_drop.move_down();
    }
    for (let l of this.listeners) {
      l.update_y_position(this.y);
    }
  }


  set_child(child) {
    if (this.child_drop) {
      console.log("neida");
      this.child_drop.set_child(child);
    } else {
      this.child_drop = child;
    }
  }
}

export default CoffeeDrop;
