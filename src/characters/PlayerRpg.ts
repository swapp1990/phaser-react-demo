enum HealthState {
  IDLE,
  DAMAGE,
  DEAD,
}

export class PlayerRpg extends Phaser.Physics.Arcade.Sprite {
  private healthState = HealthState.IDLE;
  private damageTime = 0;
  private _health = 3;
  private knives?: Phaser.Physics.Arcade.Group;

  get health() {
    return this._health;
  }

  setKnives(knives: Phaser.Physics.Arcade.Group) {
    this.knives = knives;
  }
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

  private throwKnife() {
    if (!this.anims.currentAnim) return;
    const direction = this.anims.currentAnim.key;
    const vec = new Phaser.Math.Vector2(0, 0);
    switch (direction) {
      case "up":
        vec.y = -1;
        break;
      case "down":
        vec.y = 1;
        break;
      case "left":
        vec.x = -1;
        break;
      case "right":
        vec.x = 1;
        break;
    }

    const angle = vec.angle();

    var knife = this.knives?.get(
      this.x,
      this.y,
      "knife"
    ) as Phaser.Physics.Arcade.Image;
    knife.setActive(true);
    knife.setVisible(true);
    knife.setRotation(angle);
    knife.x += vec.x * 16;
    knife.y += vec.y * 16;
    knife.setVelocity(vec.x * 300, vec.y * 300);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (
      this.healthState === HealthState.DAMAGE ||
      this.healthState === HealthState.DEAD
    ) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(cursors.space!)) {
      this.throwKnife();
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
    if (this._health <= 0) return;
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    --this._health;
    console.log(this._health);
    if (this._health <= 0) {
      this.healthState = HealthState.DEAD;
      this.setTint(0xff8102);
      this.setVelocity(0, 0);
      this.anims.stop();
    } else {
      this.setVelocity(dir.x, dir.y);
      this.setTint(0xff0000);
      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
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
