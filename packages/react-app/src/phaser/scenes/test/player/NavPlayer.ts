import { EventEnum, phaserEvents } from "../../../../events/EventsCenter";
import { createCharacterAnims } from "../../../anims/CharacterAnims";
import { updateCharacterAnims } from "../../../anims/RpgAnims";

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD,
}

const map = (value, min, max, newMin, newMax) => {
  return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
};
const characterFrames = [
  {
    name: "Jason",
    startFrame: 0,
    anims: [
      { name: "up", start: 36, end: 38 },
      { name: "left", start: 12, end: 14 },
      { name: "right", start: 24, end: 26 },
      { name: "down", start: 0, end: 2 },
    ],
  },
  {
    name: "Sarah",
    startFrame: 3,
    anims: [
      { name: "up", start: 39, end: 41 },
      { name: "left", start: 15, end: 17 },
      { name: "right", start: 27, end: 29 },
      { name: "down", start: 3, end: 5 },
    ],
  },
  {
    name: "Max",
    startFrame: 6,
    anims: [
      { name: "up", start: 12 * 3 + 6, end: 12 * 3 + 6 + 2 },
      { name: "left", start: 12 * 2 + 6, end: 12 * 2 + 6 + 2 },
      { name: "right", start: 12 + 6, end: 12 * 2 + 6 + 2 },
      { name: "down", start: 6, end: 9 },
    ],
  },
  {
    name: "Layla",
    startFrame: 9,
    anims: [
      { name: "up", start: 12 * 3 + 9, end: 12 * 3 + 9 + 2 },
      { name: "left", start: 12 * 2 + 9, end: 12 * 2 + 9 + 2 },
      { name: "right", start: 12 + 9, end: 12 * 2 + 9 + 2 },
      { name: "down", start: 9, end: 11 },
    ],
  },
  {
    name: "Dwayne",
    startFrame: 48,
    anims: [
      { name: "up", start: 12 * 3 + 48, end: 12 * 3 + 48 + 2 },
      { name: "left", start: 12 * 2 + 48, end: 12 * 2 + 48 + 2 },
      { name: "right", start: 12 + 48, end: 12 * 2 + 48 + 2 },
      { name: "down", start: 48, end: 50 },
    ],
  },
  {
    name: "Brand",
    startFrame: 55,
    anims: [
      { name: "up", start: 12 * 3 + 55, end: 12 * 3 + 55 + 2 },
      { name: "left", start: 12 * 2 + 55, end: 12 * 2 + 55 + 2 },
      { name: "right", start: 12 + 55, end: 12 * 2 + 55 + 2 },
      { name: "down", start: 55, end: 57 },
    ],
  },
];

export class NavPlayer extends Phaser.Physics.Arcade.Sprite {
  private navMesh: any;
  private path;
  private currentTarget;
  private selectedCharacterName: string = "Jason";
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
    this.scale = 1.2;
    let selCharacter = characterFrames.find(
      (c) => c.name == this.selectedCharacterName
    );
    if (selCharacter) {
      this.setFrame(selCharacter.startFrame);
      updateCharacterAnims(this.anims, selCharacter);
    } else {
      this.setFrame(0);
    }
    this.path = null;
    this.currentTarget = null;
    // createCharacterAnims(this.anims.animationManager);
  }

  public updateCharacter(characterName: string) {
    let selCharacter = characterFrames.find((c) => c.name == characterName);
    // console.log({ initStartFrame });
    if (selCharacter) {
      this.setFrame(selCharacter.startFrame);
      updateCharacterAnims(this.anims, selCharacter);
      this.selectedCharacterName = characterName;
    }
  }

  setNavMesh(navMesh) {
    this.navMesh = navMesh;
  }

  goTo(targetPoint) {
    // Find a path to the target
    this.path = this.navMesh.findPath(
      new Phaser.Math.Vector2(this.x, this.y),
      targetPoint
    );
    // If there is a valid path, grab the first point from the path and set it as the target
    if (this.path && this.path.length > 0)
      this.currentTarget = this.path.shift();
    else this.currentTarget = null;
  }

  preUpdate(t: number, dt: number) {
    //Without super.preUpdate anims stops working
    super.preUpdate(t, dt);
    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += dt;
        // console.log(this.damageTime);
        if (this.damageTime >= 350) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;
    }
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

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    keyR: Phaser.Input.Keyboard.Key,
    delta: number
  ) {
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
    // this.body.velocity.set(0);
    // if (this.currentTarget) {
    //   const { x, y } = this.currentTarget;
    //   const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);

    //   if (distance < 5) {
    //     // If there is path left, grab the next point. Otherwise, null the target.
    //     if (this.path.length > 0) this.currentTarget = this.path.shift();
    //     else this.currentTarget = null;
    //   }
    //   let speed = 200;
    //   if (this.path.length === 0 && distance < 50) {
    //     speed = map(distance, 50, 0, speed, 50);
    //   }
    //   // Still got a valid target?
    //   if (this.currentTarget)
    //     this.moveTowards(this.currentTarget, speed, delta / 1000);
    // }
  }

  public handleDamage(dir: Phaser.Math.Vector2) {
    if (this._health <= 0) return;
    if (this.healthState === HealthState.DAMAGE) {
      return;
    }

    --this._health;
    // console.log(this._health);
    // console.log(dir);
    if (this._health == 0) {
      this.healthState = HealthState.DEAD;
      this.setTint(0xff8102);
      this.setVelocity(0, 0);
      this.anims.stop();
      phaserEvents.emit(EventEnum.CHAR_DIED, this.selectedCharacterName);
    } else if (this._health > 0) {
      this.damageTime = 0;
      this.setVelocity(dir.x, dir.y);
      this.setTint(0xff0000);
      this.healthState = HealthState.DAMAGE;
    }
  }

  moveTowards(targetPosition, maxSpeed = 200, elapsedSeconds) {
    const { x, y } = targetPosition;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
    const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
    const targetSpeed = distance / elapsedSeconds;
    const magnitude = Math.min(maxSpeed, targetSpeed);
    this.scene.physics.velocityFromRotation(
      angle,
      magnitude,
      this.body.velocity
    );
    // this.rotation = angle;
  }
}
