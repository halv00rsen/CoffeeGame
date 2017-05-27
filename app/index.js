
// const Application = require("./logic/main.js");

import Application from "./logic/Application";
import Main from "./GUI/Main";
import Game from "./Game";

const app = new Application();
const gui = new Main(document.getElementById("game"));

app.add_listener(gui);
const game = new Game(app, gui);
