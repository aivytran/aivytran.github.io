const Arrow = require("./arrow");
const Util = require("./util");

class Game {
  constructor() {
    this.arrows = [];
    this.keys = []
    this.addArrows();
    this.addKeys();
    this.score = 0;
    this.checkScore = this.checkScore.bind(this)
  }

  addArrows() {
    for (let i = 0; i < 4; i++) {
      this.arrows.push(new Arrow({
        game: this,
        color: "red",
        pos: [(Game.DIM_X/4 + i*105)+150, 0]}));
    }
  }

  addKeys() {
    for (let i = 0; i < 4; i++) {
      this.keys.push(new Arrow({
        game: this,
        color: "blue",
        pos: [(Game.DIM_X/4 + i*105)+150, 400]}));
    }
  }

  allObjects() {
    return [].concat(this.arrows, this.keys);
  }

  checkScore(key, arrow) {
    const match = Math.abs(key.pos[1] - arrow.pos[1])
    if ( match <= 30 ) {
      this.score += 20
    } else if (match <= 60) {
      this.score += 10
    } else if (match <= 100) {
      this.score += 5
    }
    return this.score
  }


  draw(ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_X);

    this.arrows.forEach((object, idx) => {
      if (Game.SIGN[idx]) {
        object.draw(ctx, Game.SIGN[idx]);
      }
    });
    this.keys.forEach((object, idx) => {
      object.draw(ctx, Game.KEYSIGN[idx]);
    });
  }

  isOutOfBounds(pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  }

  moveObjects(delta) {
    this.arrows.forEach((object, idx) => {
      object.move(delta);
    });
  }

  arrowPosition() {
    return [
      Game.DIM_X * Math.random(),
      Game.DIM_Y * Math.random()
    ];
  }

  remove(object) {
    if (object instanceof Arrow) {
      this.arrows.splice(this.arrows.indexOf(object), 1);
    } else {
      throw "unknown type of object";
    }
  }

  step(delta) {
    this.moveObjects(delta);
  }

  wrap(pos) {
    return [
      Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
    ];
  }
}

Game.BG_COLOR = "white";
Game.DIM_X = 800;
Game.DIM_Y = 500;
Game.FPS = 32;
Game.NUM_ARROWS = 3;
Game.SIGN = ["left", "up", "down", "right"]
Game.KEYSIGN = ["left1", "up1", "down1", "right1"]

module.exports = Game;
