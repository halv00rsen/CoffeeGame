
class Game {
  constructor() {
    this.counter = 0;
  }


  new_game(player1, player2) {
    setInterval(() => {
      player2.emit("play", {data: this.counter});
      player1.emit("play", {data: this.counter});
      this.counter++;
    }, 1000);
  }

}

module.exports =  Game;
