export default class Item extends Phaser.Physics.Arcade.Sprite {
  private dialogBox!: Phaser.GameObjects.Container;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    // add dialogBox and statusBox containers on top of everything which we can add text in later
    this.dialogBox = this.scene.add.container().setDepth(10000);
  }

  // add texts into dialog box container
  setDialogBox(text: string) {
    const innerText = this.scene.add
      .text(0, 0, text)
      .setFontFamily("Arial")
      .setFontSize(12)
      .setColor("#000000");

    // set dialogBox slightly larger than the text in it
    const dialogBoxWidth = innerText.width + 4;
    const dialogBoxHeight = innerText.height + 2;
    const dialogBoxX = this.x - dialogBoxWidth * 0.5;
    const dialogBoxY = this.y + this.height * 0.5;

    this.dialogBox.add(
      this.scene.add
        .graphics()
        .fillStyle(0xffffff, 1)
        .fillRoundedRect(
          dialogBoxX,
          dialogBoxY,
          dialogBoxWidth,
          dialogBoxHeight,
          3
        )
        .lineStyle(1.5, 0x000000, 1)
        .strokeRoundedRect(
          dialogBoxX,
          dialogBoxY,
          dialogBoxWidth,
          dialogBoxHeight,
          3
        )
    );
    this.dialogBox.add(innerText.setPosition(dialogBoxX + 2, dialogBoxY));
  }

  // remove everything in the dialog box container
  clearDialogBox() {
    this.dialogBox.removeAll(true);
  }
}
