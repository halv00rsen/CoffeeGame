
import { cup_empty_num } from "../constants";

class InformationText {

  constructor() {
    this.misses = 0;
    this.fills = 0;
  }


  set_data(m, f) {
    this.misses = m;
    this.fills = f;
  }

  paint(ctx, rel) {
    ctx.beginPath();
    ctx.font = "20px Georgia";
    // ctx.fillText("Hits: " + this.hits, 10 * rel.x, 20 * rel.y);
    ctx.fillText("Total fills: " + Math.floor(this.fills / cup_empty_num), 10 * rel.x, 70 * rel.y);
    ctx.fillText("Misses: " + this.misses, 10 * rel.x, 45 * rel.y);
  }
}

export default InformationText;
