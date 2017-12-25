
class UserInput {
  constructor(listener) {
    this.valid_nums = [
      37, 72, 39, 76, 32
    ];
    window.addEventListener("keydown", e => {
      if (this.valid_nums.indexOf(e.keyCode) != -1) {
        e.preventDefault();
      }
      if (e.keyCode === 37 || e.keyCode === 72) {
        listener.left_key = true;
      } else if (e.keyCode === 39 || e.keyCode === 76) {
        listener.right_key = true;
      } else if (e.keyCode === 27) { //Escape key
        // listener.pause();
      } else if (e.keyCode === 13) { //enter key
        // listener.start();
      } else if (e.keyCode === 78) {//n key
        // listener.new_game();
      } else if (e.keyCode === 32) { // space key
        listener.space_key = true;
      }
    });

    window.addEventListener("keyup", e => {
      // e.preventDefault();
      if (this.valid_nums.indexOf(e.keyCode) != -1) {
        e.preventDefault();
      }
      if (e.keyCode === 37 || e.keyCode === 72) {
        listener.left_key = false;
      } else if (e.keyCode === 39 || e.keyCode === 76) {
        listener.right_key = false;
      } else if (e.keyCode === 32) {
        listener.space_key = false;
      } 
    });
  }
}

export default UserInput;
