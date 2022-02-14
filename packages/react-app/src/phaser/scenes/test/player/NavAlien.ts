import { createCharacterAnims } from "../../../anims/CharacterAnims";

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD,
}

const map = (value, min, max, newMin, newMax) => {
  return ((value - min) / (max - min)) * (newMax - newMin) + newMin;
};

export class NavAlien extends Phaser.Physics.Arcade.Sprite {
  private navMesh: any;
  private pickups;
  private path;
  private currentTarget;
  private currentDest;

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
    this.setFrame(0);
    this.path = null;
    this.currentTarget = null;
  }

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandomPoint() {
    let foundViablePathPoint = false;
    let randX;
    let randY;
    while (!foundViablePathPoint) {
      randX = this.randomIntFromInterval(20, 600);
      randY = this.randomIntFromInterval(20, 600);
      let targetPoint = new Phaser.Math.Vector2(randX, randY);
      //   console.log({ targetPoint });
      this.path = this.navMesh.findPath(
        new Phaser.Math.Vector2(this.x, this.y),
        targetPoint
      );
      if (this.path && this.path.length > 0) {
        this.currentTarget = this.path.shift();
        // console.log(this.currentTarget);
        foundViablePathPoint = true;
      }
    }
  }

  setTargetFromPath(point: Phaser.Math.Vector2) {
    this.path = this.navMesh.findPath(
      new Phaser.Math.Vector2(this.x, this.y),
      point
    );
    if (this.path && this.path.length > 0) {
      this.currentTarget = this.path.shift();
      // console.log(this.currentTarget);
      return true;
    }
    return false;
  }

  setNavMesh(navMesh, pickups) {
    this.navMesh = navMesh;
    this.pickups = pickups;
    this.setTargetForMovement();
    // this.currentDest = this.getRandomPoint();
  }

  setTargetForMovement() {
    let pickupPoints = this.pickups.children.entries.map((spr) => {
      return new Phaser.Math.Vector2(spr.x, spr.y);
    });
    // console.log({ pickupPoints: pickupPoints.length });
    if (pickupPoints.length > 0) {
      var randomPoint =
        pickupPoints[Math.floor(Math.random() * pickupPoints.length)];
      this.setTargetFromPath(randomPoint);
    } else {
      this.getRandomPoint();
    }
    // console.log(pickupPoints);
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
    super.preUpdate(t, dt);
    const speed = 80;
    this.body.velocity.set(0);
    if (this.currentTarget) {
      //   console.log(this.currentTarget);
      //   console.log(this.currentTarget);
      this.moveTowards(this.currentTarget, speed, dt / 1000);
      if (this.isCurrentTargetReached()) {
        if (this.path.length > 0) {
          this.currentTarget = this.path.shift();
        } else {
          //   this.currentDest = this.getRandomPoint();
          this.setTargetForMovement();
        }
      }
    }
  }

  isCurrentTargetReached() {
    const { x, y } = this.currentTarget;
    const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
    if (distance < 5) {
      return true;
    } else {
      return false;
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
