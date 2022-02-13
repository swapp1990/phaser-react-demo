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
    name: "Emily",
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
    startFrame: 54,
    anims: [
      { name: "up", start: 90, end: 92 },
      { name: "left", start: 66, end: 68 },
      { name: "right", start: 78, end: 80 },
      { name: "down", start: 54, end: 56 },
    ],
  },
];
export class NavPlayer extends Phaser.Physics.Arcade.Sprite {
  private navMesh: any;
  private path;
  private currentTarget;
  private selectedCharacterName: string = "Jason";

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

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    keyR: Phaser.Input.Keyboard.Key,
    delta: number
  ) {
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
