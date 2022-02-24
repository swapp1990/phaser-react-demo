import Phaser from "phaser";

const sceneEvents = new Phaser.Events.EventEmitter();
const reactEvents = new Phaser.Events.EventEmitter();
const phaserEvents = new Phaser.Events.EventEmitter();

enum EventEnum {
  PLAYER_UPDATED = "player-updated",
  PLAYER_MINTED = "player-minted",
  CONNECT_WEB3 = "connect-web3",
  MINT_CHARS = "mint-chars",
  PICKED_NFT = "pickup-nft",
  CHAR_DIED = "char-died",
  SPAWN_NEW_CHAR = "spawn",
  GAME_OVER = "game",
  GAME_INIT = "init",
  REFRESH_LB = "refresh_lb",
  REFRESH_GEARS = "refresh-gears",
  NFT_CLOSED = "nft-closed"
}

export { sceneEvents, reactEvents, phaserEvents, EventEnum };
