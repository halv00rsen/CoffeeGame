
import { canvas_width, canvas_height } from "../constants";

class PauseScreen {
  constructor() {

  }

  paint(ctx, rel) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect(0, 0, canvas_width, canvas_height);
  }
}

export default PauseScreen;
