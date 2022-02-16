import Phaser from "phaser";
import PhaserNavMeshPlugin from "phaser-navmesh";
import NavMeshTestScene from "../phaser/scenes/test/NavMeshTestScene";
import LoadingScene from "../phaser/scenes/test/LoadingScene";
import GameOverScene from "../phaser/scenes/test/GameOverScene";

// import "./styles.css";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-container",
  width: 750,
  height: 750,
  scene: [NavMeshTestScene, GameOverScene],
  plugins: {
    scene: [
      {
        key: "PhaserNavMeshPlugin", // Key to store the plugin class under in cache
        plugin: PhaserNavMeshPlugin, // Class that constructs plugins
        mapping: "navMeshPlugin", // Property mapping to use for the scene, e.g. this.navMeshPlugin
        start: true,
      },
    ],
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: 0,
    },
  },
});
