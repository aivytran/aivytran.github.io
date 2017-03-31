const Arrow = require("./arrow");
class GameView {
  constructor(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.bindKeyHandlers = this.bindKeyHandlers.bind(this)
  }

  bindKeyHandlers() {
    GameView.MOVES.forEach((k, idx) => {
      let move = GameView.MOVES[k];
      key(k, () => {
        this.game.keys[idx].draw(this.ctx, "left")
        const score = this.game.checkScore(this.game.keys[idx], this.game.arrows[idx]);
        $('#score').text(score)
    })})
  }

  start() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    this.playMusic()
    requestAnimationFrame(this.animate.bind(this));
  }

  animate(time) {
    const timeDelta = time - this.lastTime;
    this.game.step(timeDelta);
    this.game.draw(this.ctx);
    this.lastTime = time;
    requestAnimationFrame(this.animate.bind(this));
  }



  playMusic() {
    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.on("fileload", (event) => {
     var instance = createjs.Sound.play("sound");
    //  instance.on("complete", this.handleComplete, this);
     instance.volume = 0.5;
    }, this);
    createjs.Sound.registerSound("http://res.cloudinary.com/candycanetrain/video/upload/v1490983415/ShakeItOff_oq56dd.mp3", "sound");
    // createjs.Sound.registerSound("http://res.cloudinary.com/candycanetrain/video/upload/v1490983260/Dub-I-Dub_o6zs0w.mp3", "sound");
  }
}

GameView.KEYSIGN = ["left1", "up1", "down1", "right1"]
GameView.MOVES = ["left", "up", "down", "right"]

module.exports = GameView;
