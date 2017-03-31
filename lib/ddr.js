const Game = require("./game");
const GameView = require("./game_view");

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
