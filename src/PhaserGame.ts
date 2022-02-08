import Phaser from "phaser";
import Bootstrap from "./scenes/Bootstrap";
import Game from "./scenes/Game";
import Background from "./scenes/Background";
import RpgGame from "./scenes/rpg/RpgGame";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  backgroundColor: "#93cbee",
  pixelArt: true, // Prevent pixel art from becoming blurred when scaled.
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
  autoFocus: true,
  scene: [RpgGame],
};
const phaserGame = new Phaser.Game(config);
(window as any).game = phaserGame;
export default phaserGame;
