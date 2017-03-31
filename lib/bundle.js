/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Game = __webpack_require__(1);
const GameView = __webpack_require__(2);

document.addEventListener("DOMContentLoaded", function(){
  // document.getElementsByClassName('song-choice').on('click', () => {
  //   console.log("clicked");
  //   document.getElementsByClassName('sound1').play()
  // })
  const canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;
  const ctx = canvasEl.getContext("2d");
  const game = new Game();
  const gameView = new GameView(game, ctx)
  gameView.start();
 }
);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Arrow = __webpack_require__(4);
const Util = __webpack_require__(3);

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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Arrow = __webpack_require__(4);
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
    // this.playMusic()
    $('.song-choice').on('click', () => {
      createjs.Sound.alternateExtensions = ["mp3"];
      createjs.Sound.on("fileload", (event) => {
       var instance = createjs.Sound.play("sound1");
       instance.volume = 0.5;
      }, this);
      createjs.Sound.registerSound("https://github.com/aivytran/aivytran.github.io/tree/master/music/Dub-I-Dub.mp3", "sound1");
    })
    $('.song-choice1').on('click', () => {
      createjs.Sound.stop("sound1")
      createjs.Sound.alternateExtensions = ["mp3"];
      createjs.Sound.on("fileload", (event) => {
       var instance = createjs.Sound.play("sound2");
       instance.volume = 0.5;
      }, this);
      createjs.Sound.registerSound("https://github.com/aivytran/aivytran.github.io/tree/master/musicShakeItOff.mp3", "sound2");
    })
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
    // createjs.Sound.registerSound("/Users/tianhan/Documents/aivytran/DDR/aivytran.github.io/music/ShakeItOff.mp3", "sound");
    createjs.Sound.registerSound("/Users/tianhan/Documents/aivytran/DDR/aivytran.github.io/music/Dub-I-Dub.mp3", "sound");
  }
}

GameView.KEYSIGN = ["left1", "up1", "down1", "right1"]
GameView.MOVES = ["left", "up", "down", "right"]

module.exports = GameView;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

const Util = {
  randomVec (length) {
    let rand = Math.random()
    let deg = 2 * Math.PI * rand;
    return Util.scale([Math.sin(deg), Math.cos(deg)*2], length);
  },
  
  scale (vec, m) {
    return [vec[0] * m , vec[1] * m];
  },

  wrap (coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  }
};

module.exports = Util;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(3);
const MovingArrow = __webpack_require__(5);
// const Ship = require("./ship");
// const Bullet = require("./bullet");

const DEFAULTS = {
	RADIUS: 25,
	SPEED: 4
};

class Arrow extends MovingArrow {
    constructor(options = {}) {
      options.pos = options.pos
      options.radius = DEFAULTS.RADIUS;
      options.vel = Util.randomVec(DEFAULTS.SPEED);
			super(options);
    }
}

module.exports = Arrow;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Util = __webpack_require__(3);

class MovingArrow {
  constructor(options) {
    this.pos = options.pos;
    this.vel = options.vel;
    this.radius = options.radius;
    this.color = options.color;
    this.game = options.game;
    this.isWrappable = true;
  }

  collideWith(otherObject) {
    // default do nothing
  }

  draw(ctx, sign) {
    const img = new Image();
    img.src = `./images/${sign}.png`
    ctx.drawImage(img, this.pos[0], this.pos[1]);
    ctx.fill();
  }

  move(timeDelta) {
    const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
        offsetY = Math.abs(this.vel[1]) * velocityScale;
    this.pos = [this.pos[0], this.pos[1] + offsetY];
    // console.log(velocityScale);
    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isWrappable) {
        this.pos = this.game.wrap(this.pos);
      } else {
        this.remove();
      }
    }
  }

  remove() {
    this.game.remove(this);
  }
}

const NORMAL_FRAME_TIME_DELTA = 1000/60;

module.exports = MovingArrow;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map