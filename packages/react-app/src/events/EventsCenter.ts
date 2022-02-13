import Phaser from "phaser";

const sceneEvents = new Phaser.Events.EventEmitter();
const reactEvents = new Phaser.Events.EventEmitter();

enum EventEnum {
  PLAYER_UPDATED = "player-updated",
}

export { sceneEvents, reactEvents, EventEnum };
