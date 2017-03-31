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
