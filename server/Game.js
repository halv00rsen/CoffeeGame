
class Game {
  constructor(player1, player2) {
    this.counter = 0;
    this.player2 = player2;
    this.player1 = player1;
  }


  new_game() {
    
    setInterval(() => {
      this.player2.emit("play", {data: this.counter});
      this.player1.emit("play", {data: this.counter});
      this.counter++;
    }, 1000);
  }

  toString() {
    return "Game instance, counter: " + this.counter;
  }
}

module.exports = Game;
