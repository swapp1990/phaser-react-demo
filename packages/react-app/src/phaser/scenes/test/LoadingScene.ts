import {
  EventEnum,
  phaserEvents,
  reactEvents,
  sceneEvents,
} from "../../../events/EventsCenter";

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({
      key: "load",
    });
  }

  preload() {}

  create() {
    const styleBtn = {
      font: "22px Josefin Sans",
      fill: "#0f0",
      padding: { x: 20, y: 10 },
    };
    const playButton = this.add.text(100, 300, "Play Demo", styleBtn);
    playButton.setInteractive();
    playButton.on("pointerdown", () => {
      this.scene.launch("start");
      phaserEvents.emit(EventEnum.GAME_INIT);
    });
    playButton.on("pointerover", () => {
      playButton.setStyle({ fill: "#ff0" });
    });
    playButton.on("pointerout", () => {
      playButton.setStyle({ fill: "#0f0" });
    });

    const connectButton = this.add.text(400, 300, "Connect Metamask", styleBtn);
    connectButton.setInteractive();
    connectButton.on("pointerdown", () => {});
    connectButton.on("pointerover", () => {
      connectButton.setStyle({ fill: "#ff0" });
    });
    connectButton.on("pointerout", () => {
      connectButton.setStyle({ fill: "#0f0" });
    });
  }

  handlePlayerMinted() {
    console.log("handlePlayerMinted");
    this.scene.launch("start");
  }
}
