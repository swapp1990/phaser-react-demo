enum Direction {
  NONE = "none",
  LEFT = "left",
  UP = "up",
  RIGHT = "right",
  DOWN = "down",
}

export class Lizard extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.LEFT;
  private moveEvent: Phaser.Time.TimerEvent;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);

    this.anims.play("lizard-idle");
    this.setDepth(3);
    this.scale = 2;

    console.log(Object.values(Direction));

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this
    );

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = this.getRandomDirection();
      },
      loop: true,
    });
  }

  private getRandomDirection() {
    let oldDir = Object.values(Direction).indexOf(this.direction);
    let newDirection = this.getRandomWithExclude(1, 4, [oldDir]);
    // console.log(newDirection, oldDir);
    return Object.values(Direction)[newDirection];
  }

  private getRandomWithExclude(min, max, excludeArray) {
    const randomNumber =
      Math.floor(Math.random() * (max - min + 1 - excludeArray.length)) + min;
    return (
      randomNumber +
      excludeArray
        .sort((a, b) => a - b)
        .reduce((acc, element) => {
          return randomNumber >= element - acc ? acc + 1 : acc;
        }, 0)
    );
  }

  private handleTileCollision(
    go: Phaser.GameObjects.GameObject,
    tile: Phaser.Tilemaps.Tile
  ) {
    if (go !== this) {
      return;
    }

    this.direction = this.getRandomDirection();
  }

  preUpdate(t: number, dt: number) {
    super.preUpdate(t, dt);
    const speed = 80;

    switch (this.direction) {
      case Direction.UP:
        this.setVelocity(0, -speed);
        break;
      case Direction.DOWN:
        this.setVelocity(0, speed);
        break;
      case Direction.LEFT:
        this.setVelocity(-speed, 0);
        break;
      case Direction.RIGHT:
        this.setVelocity(speed, 0);
        break;
    }
  }

  destroy(fromScene?: boolean) {
    this.moveEvent.destroy();
    super.destroy();
  }
}
