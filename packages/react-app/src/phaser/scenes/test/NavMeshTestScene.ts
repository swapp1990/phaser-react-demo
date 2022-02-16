import PhaserNavMeshPlugin from "phaser-navmesh";
import {
  EventEnum,
  reactEvents,
  sceneEvents,
} from "../../../events/EventsCenter";
import FollowerSprite from "../../../games/follower";
import store from "../../../stores";
import {
  incrementAliensKilled,
  incrementCoinsCollected,
  resetState,
} from "../../../stores/PickupStore";
import { createCharacterAnims, createLizardAnims } from "../../anims/RpgAnims";
import Pickup from "../../items/Pickup";
import { NavAlien } from "./player/NavAlien";
import { NavPlayer } from "./player/NavPlayer";

export default class NavMeshTestScene extends Phaser.Scene {
  navMeshPlugin: PhaserNavMeshPlugin;
  private navMesh;
  private players!: Phaser.Physics.Arcade.Group;
  private currPlayer;
  private aliens!: Phaser.Physics.Arcade.Group;
  private pickups;
  private playerAlienCollider?: Phaser.Physics.Arcade.Collider;
  private knives!: Phaser.Physics.Arcade.Group;
  private alienReplicateTimer;
  private wallLayer;
  private countdownText;
  private instructionText;
  private countdown: number = 100;

  constructor() {
    super({
      key: "start",
    });
  }

  preload() {
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
    console.log("create");
    reactEvents.on(EventEnum.PLAYER_UPDATED, this.handlePlayerUpdated, this);
    // reactEvents.on(EventEnum.PLAYER_MINTED, this.handlePlayerMinted, this);
    reactEvents.on(EventEnum.SPAWN_NEW_CHAR, this.handleSpawnChar, this);
    reactEvents.on(EventEnum.GAME_OVER, this.handleGameOver, this);

    createCharacterAnims(this.anims);
    createLizardAnims(this.anims);
    const tilemap = this.add.tilemap("map");
    const wallTileset = tilemap.addTilesetImage("tiles", "tiles");
    tilemap.createLayer("bg", wallTileset);
    this.wallLayer = tilemap.createLayer("walls", wallTileset);
    this.wallLayer.setCollisionByProperty({ collides: true });
    const objectLayer = tilemap.getObjectLayer("navmesh");
    this.navMesh = this.navMeshPlugin.buildMeshFromTiled(
      "mesh1",
      objectLayer,
      12.5
    );
    const graphics = this.add.graphics({ x: 0, y: 0 }).setAlpha(0.5);
    this.navMesh.enableDebug(graphics);

    this.players = this.physics.add.group({
      classType: NavPlayer,
    });

    this.aliens = this.physics.add.group({
      classType: NavAlien,
    });

    this.addInstructions();

    // const follower = new FollowerSprite(this, 50, 200, navMesh);

    this.pickups = this.add.group({
      // once a heart is removed, it's added to the pool
      classType: Pickup,
    });
    this.refreshPickups();

    let alien1 = this.aliens.get(20, 30, "lizard");
    alien1.setNavMesh(this.navMesh, this.pickups);
    let alien2 = this.aliens.get(50, 680, "lizard");
    alien2.setNavMesh(this.navMesh, this.pickups);

    // this.input.on("pointerdown", (pointer) => {
    //   const start = new Phaser.Math.Vector2(this.currPlayer.x, this.currPlayer.y);
    //   const end = new Phaser.Math.Vector2(pointer.x, pointer.y);
    //   this.currPlayer.goTo(end);
    // });

    this.physics.add.overlap(this.aliens, this.pickups, (hrt, alien) => {
      //   console.log(alien, hrt);
      this.pickups.killAndHide(hrt);
      this.pickups.remove(hrt);
      //   store.dispatch(incrementCoinsCollected({}));
    });

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    // this.addCharacterToGame();

    this.physics.add.collider(
      this.knives,
      this.wallLayer,
      this.handleKnifeWallsCollision,
      undefined,
      this
    );

    this.physics.add.collider(
      this.knives,
      this.aliens,
      this.handleKnifeLizardCollision,
      undefined,
      this
    );

    //timer
    this.alienReplicateTimer = this.time.addEvent({
      delay: 5000, // ms
      callback: this.replicateRandomAliveAlien,
      callbackScope: this,
      loop: true,
      //args: [],
      //   repeat: 4,
    });

    this.time.addEvent({
      delay: 10000, // ms
      callback: this.refreshPickups,
      callbackScope: this,
      loop: true,
      //args: [],
      //   repeat: 4,
    });

    this.addCountdown();

    this.scene.pause();
  }

  addInstructions() {
    const style = {
      font: "22px Josefin Sans",
      fill: "#ff0044",
      padding: { x: 20, y: 10 },
      backgroundColor: "#fff",
    };
    const uiTextLines = [
      "Connect Metamask",
      "Mint your characters",
      "Play the game",
      "Get on the leaderboard",
    ];
    this.instructionText = this.add
      .text(10, 5, uiTextLines, style)
      .setAlpha(0.9);
  }

  addCountdown() {
    const style = {
      font: "18px Josefin Sans",
      fill: "#000000",
      padding: { x: 20, y: 10 },
      backgroundColor: "#fff",
    };
    const uiTextLines = ["Time Left: 100s"];
    this.countdownText = this.add
      .text(590, 5, uiTextLines, style)
      .setAlpha(0.9);

    this.time.addEvent({
      delay: 1000, // ms
      callback: this.incrementCount,
      callbackScope: this,
      loop: true,
    });
  }

  incrementCount() {
    if (this.countdown == 0) {
      reactEvents.emit(EventEnum.GAME_OVER);
    } else {
      this.countdown = this.countdown - 1;
      let text = "Time Left: " + this.countdown + "s";
      this.countdownText.setText(text);
    }
  }

  addCharacterToGame() {
    this.currPlayer = this.players.get(300, 250, "player");
    this.currPlayer.setNavMesh(this.navMesh);
    this.physics.add.collider(this.currPlayer, this.wallLayer);
    this.playerAlienCollider = this.physics.add.collider(
      this.aliens,
      this.currPlayer,
      this.handlePlayerAlienCollision,
      undefined,
      this
    );
    this.currPlayer.setKnives(this.knives);
    this.physics.add.overlap(this.currPlayer, this.pickups, (player, hrt) => {
      //   console.log(player, hrt);
      this.pickups.killAndHide(hrt);
      this.pickups.remove(hrt);
      store.dispatch(incrementCoinsCollected({}));
    });
    console.log("addCharacterToGame");
  }

  refreshPickups() {
    this.pickups.clear(true);
    this.addRandomPickups();
  }

  randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  replicateRandomAliveAlien() {
    let children = this.aliens.children.entries;
    // console.log("replicateRandomAliveAlien ", children.length);
    if (children.length < 10 && children.length > 0) {
      //   console.log(children);
      var randomChild: NavAlien = children[
        Math.floor(Math.random() * children.length)
      ] as NavAlien;
      this.addNewAlien(randomChild.x, randomChild.y);
    } else if (children.length == 0) {
      this.addNewAlien(20, 30);
      this.addNewAlien(20, 680);
    }
  }

  addNewAlien(x, y) {
    let alien1 = this.aliens.get(x, y, "lizard");
    alien1.setNavMesh(this.navMesh, this.pickups);
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
    this.currPlayer.updateCharacter(playerInfo.name);
  }

  private handlePlayerMinted() {}

  private handleSpawnChar(char) {
    // console.log(this.playerAlienCollider);
    if (this.playerAlienCollider && this.playerAlienCollider?.world) {
      this.playerAlienCollider?.destroy();
    }

    this.addCharacterToGame();
    this.currPlayer.updateCharacter(char.name);
    this.scene.resume();
    this.instructionText?.destroy();
  }

  private handleGameOver() {
    this.scene.pause();
    this.players.clear(true);
    this.aliens.clear(true);
    this.scene.launch("gameover");
    this.countdown = 100;
    store.dispatch(resetState({}));
  }

  public update(_time: number, delta: number) {
    const cursors = this.input.keyboard.createCursorKeys();
    const keyR = this.input.keyboard.addKey("R");
    if (this.currPlayer) {
      this.currPlayer.update(cursors, keyR, delta);
    }
  }

  private handlePlayerAlienCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const alien = obj2 as NavAlien;
    const dx = this.currPlayer.x - alien.x;
    const dy = this.currPlayer.y - alien.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    this.currPlayer.handleDamage(dir);
    sceneEvents.emit("player-health-changed", this.currPlayer.health);

    if (this.currPlayer.health <= 0) {
      console.log("health is zero");
      this.playerAlienCollider?.destroy();
    }
  }

  private handleKnifeLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    // console.log(obj1, obj2);
    this.knives.killAndHide(obj1);
    this.knives.remove(obj1);
    this.aliens.killAndHide(obj2);
    this.aliens.remove(obj2);
    store.dispatch(incrementAliensKilled({}));
  }

  private handleKnifeWallsCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
    this.knives.remove(obj1);
  }
}
