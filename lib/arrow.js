const Util = require("./util");
const MovingArrow = require("./moving_arrow");
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
