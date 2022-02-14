import PhaserNavMeshPlugin from "phaser-navmesh";
import {
  EventEnum,
  reactEvents,
  sceneEvents,
} from "../../../events/EventsCenter";
import FollowerSprite from "../../../games/follower";
import store from "../../../stores";
import { incrementCoinsCollected } from "../../../stores/PickupStore";
import { createCharacterAnims, createLizardAnims } from "../../anims/RpgAnims";
import Pickup from "../../items/Pickup";
import { NavAlien } from "./player/NavAlien";
import { NavPlayer } from "./player/NavPlayer";

export default class NavMeshTestScene extends Phaser.Scene {
  navMeshPlugin: PhaserNavMeshPlugin;
  private navMesh;
  private playerRpg;
  private aliens!: Phaser.Physics.Arcade.Group;
  private pickups;
  private playerAlienCollider?: Phaser.Physics.Arcade.Collider;
  private knives!: Phaser.Physics.Arcade.Group;

  constructor() {
    super({
      key: "start",
    });
  }

  preload() {
    //   this.load.setPath("src/");
    //   this.load.tilemapTiledJSON("map", "assets/navmesh/tilemaps/map.json");
    //   this.load.image("tiles", "assets/navmesh/tilemaps/tiles.png");
    this.load.tilemapTiledJSON("map", "assets/navmesh/tilemaps2/map.json");
    this.load.image("tiles", "assets/navmesh/tilemaps2/tiles.png");
    this.load.image("follower", "assets/navmesh/tilemaps2/follower.png");

    this.load.spritesheet("player", "assets/rpggame/characters.png", {
      frameWidth: 26,
      frameHeight: 36,
    });

    this.load.atlas(
      "lizard",
      "assets/rpggame/lizard.png",
      "assets/rpggame/lizard.json"
    );

    this.load.image("heart", "assets/rpggame/ui_heart_full.png");
    this.load.image("knife", "assets/rpggame/weapon_knife.png");
  }

  create() {
    reactEvents.on(EventEnum.PLAYER_UPDATED, this.handlePlayerUpdated, this);

    createCharacterAnims(this.anims);
    createLizardAnims(this.anims);
    const tilemap = this.add.tilemap("map");
    const wallTileset = tilemap.addTilesetImage("tiles", "tiles");
    tilemap.createLayer("bg", wallTileset);
    const wallLayer = tilemap.createLayer("walls", wallTileset);
    wallLayer.setCollisionByProperty({ collides: true });
    const objectLayer = tilemap.getObjectLayer("navmesh");
    this.navMesh = this.navMeshPlugin.buildMeshFromTiled(
      "mesh1",
      objectLayer,
      12.5
    );
    const graphics = this.add.graphics({ x: 0, y: 0 }).setAlpha(0.5);
    this.navMesh.enableDebug(graphics);

    const players = this.physics.add.group({
      classType: NavPlayer,
    });
    this.playerRpg = players.get(300, 250, "player");
    this.playerRpg.setNavMesh(this.navMesh);
    this.physics.add.collider(this.playerRpg, wallLayer);

    this.aliens = this.physics.add.group({
      classType: NavAlien,
    });

    // const follower = new FollowerSprite(this, 50, 200, navMesh);

    this.pickups = this.add.group({
      // once a heart is removed, it's added to the pool
      classType: Pickup,
    });

    this.addRandomPickups();
    let alien1 = this.aliens.get(20, 30, "lizard");
    alien1.setNavMesh(this.navMesh, this.pickups);
    let alien2 = this.aliens.get(50, 680, "lizard");
    alien2.setNavMesh(this.navMesh, this.pickups);

    this.input.on("pointerdown", (pointer) => {
      const start = new Phaser.Math.Vector2(this.playerRpg.x, this.playerRpg.y);
      const end = new Phaser.Math.Vector2(pointer.x, pointer.y);
      this.playerRpg.goTo(end);
    });

    this.physics.add.overlap(this.aliens, this.pickups, (hrt, alien) => {
      //   console.log(alien, hrt);
      this.pickups.killAndHide(hrt);
      this.pickups.remove(hrt);
      //   store.dispatch(incrementCoinsCollected({}));
    });

    this.physics.add.overlap(this.playerRpg, this.pickups, (player, hrt) => {
      //   console.log(player, hrt);
      this.pickups.killAndHide(hrt);
      this.pickups.remove(hrt);
      store.dispatch(incrementCoinsCollected({}));
    });

    this.playerAlienCollider = this.physics.add.collider(
      this.aliens,
      this.playerRpg,
      this.handlePlayerAlienCollision,
      undefined,
      this
    );

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });
    this.playerRpg.setKnives(this.knives);

    this.physics.add.collider(
      this.knives,
      this.aliens,
      this.handleKnifeLizardCollision,
      undefined,
      this
    );
  }

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandomPointOnNavMap() {
    let foundViablePathPoint = false;
    let randX;
    let randY;
    let targetPoint;
    while (!foundViablePathPoint) {
      randX = this.randomIntFromInterval(20, 600);
      randY = this.randomIntFromInterval(20, 600);
      targetPoint = new Phaser.Math.Vector2(randX, randY);
      //   console.log({ targetPoint });
      let path = this.navMesh.findPath(
        new Phaser.Math.Vector2(10, 10),
        targetPoint
      );
      if (path && path.length > 0) {
        foundViablePathPoint = true;
      }
    }
    return targetPoint;
  }

  private addRandomPickups() {
    let numPickups = 10;
    for (let i = 0; i < numPickups; i++) {
      let pickupPoint = this.getRandomPointOnNavMap();
      let hrt = this.physics.add.sprite(pickupPoint.x, pickupPoint.y, "heart");
      this.pickups.add(hrt);
    }
  }

  private handlePlayerUpdated(playerInfo) {
    this.playerRpg.updateCharacter(playerInfo.name);
  }

  public update(_time: number, delta: number) {
    const cursors = this.input.keyboard.createCursorKeys();
    const keyR = this.input.keyboard.addKey("R");
    this.playerRpg.update(cursors, keyR, delta);
  }

  private handlePlayerAlienCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const alien = obj2 as NavAlien;
    const dx = this.playerRpg.x - alien.x;
    const dy = this.playerRpg.y - alien.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    this.playerRpg.handleDamage(dir);
    sceneEvents.emit("player-health-changed", this.playerRpg.health);

    if (this.playerRpg.health <= 0) {
      this.playerAlienCollider?.destroy();
    }
  }

  private handleKnifeLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
    this.aliens.killAndHide(obj2);
  }
}
