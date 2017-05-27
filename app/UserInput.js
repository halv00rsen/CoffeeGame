
class UserInput {
  constructor(listener) {
    window.addEventListener("keydown", e => {
      if (e.keyCode === 37) {
        listener.left_key = true;
      } else if (e.keyCode === 39) {
        listener.right_key = true;
      } else if (e.keyCode === 27) { //Escape key
        listener.pause();
      } else if (e.keyCode === 13) { //enter key
        listener.start();
      } else if (e.keyCode === 78) {//n key
        listener.new_game();
      }
      // console.log("key kis");
    });

    window.addEventListener("keyup", e => {
      if (e.keyCode === 37) {
        listener.left_key = false;
      } else if (e.keyCode === 39) {
        listener.right_key = false;
      }  
    });
  }
}

export default UserInput;
