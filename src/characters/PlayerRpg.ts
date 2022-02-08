enum HealthState {
  IDLE,
  DAMAGE,
}

export class PlayerRpg extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE;
  private damageTime = 0;
  private hit = 0;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.setDepth(2);
    this.scale = 2;
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }
    const speed = 200;
    if (cursors.left.isDown) {
      this.setVelocity(-speed, 0);
      this.anims.play("left", true);
    } else if (cursors.right.isDown) {
      this.setVelocity(speed, 0);
      this.anims.play("right", true);
    } else if (cursors.up.isDown) {
      this.setVelocity(0, -speed);
      this.anims.play("up", true);
    } else if (cursors.down.isDown) {
      this.setVelocity(0, speed);
      this.anims.play("down", true);
    } else {
      this.setVelocity(0, 0);
      this.anims.stop();
    }
  }

  public handleDamage(dir: Phaser.Math.Vector2) {
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }
    this.hit = 1;
    this.setVelocity(dir.x, dir.y);
    this.setTint(0xff0000);
    this.healthState = HealthState.DAMAGE;
    this.damageTime = 0;
  }

  preUpdate(t: number, dt: number) {
    //Without super.preUpdate anims stops working
    super.preUpdate(t, dt);
    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += dt;
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
    }
  }
}
