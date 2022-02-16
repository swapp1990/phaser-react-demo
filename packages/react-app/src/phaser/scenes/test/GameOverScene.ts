import {
  EventEnum,
  phaserEvents,
  reactEvents,
  sceneEvents,
} from "../../../events/EventsCenter";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({
      key: "gameover",
    });
  }

  create() {
    const style = {
      font: "22px Josefin Sans",
      fill: "#ff0044",
      padding: { x: 20, y: 10 },
      backgroundColor: "#fff",
    };
    const uiTextLines = ["Game Over"];
    const uiText = this.add.text(10, 5, uiTextLines, style).setAlpha(0.9);

    const styleBtn = {
      font: "22px Josefin Sans",
      fill: "#0f0",
      padding: { x: 20, y: 10 },
    };
    const gameoverButton = this.add.text(100, 300, "Play Again", styleBtn);
    gameoverButton.setInteractive();
    gameoverButton.on("pointerdown", () => {
      this.scene.stop();
      //   this.scene.launch("start");
      phaserEvents.emit(EventEnum.GAME_INIT);
    });
    gameoverButton.on("pointerover", () => {
      gameoverButton.setStyle({ fill: "#ff0" });
    });
    gameoverButton.on("pointerout", () => {
      gameoverButton.setStyle({ fill: "#0f0" });
    });
  }
}
