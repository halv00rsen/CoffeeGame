
class CoffeeDrop {
    constructor(x, down) {
        this.down = down;
        this.y = (down ? 0 : 500);
        this.x = x; 
    }

    move() {
        if (this.down) {
            this.y++;
        } else {
            this.y--;
        }
    }
}

module.exports = CoffeeDrop;
