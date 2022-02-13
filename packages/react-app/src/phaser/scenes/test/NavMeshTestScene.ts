import PhaserNavMeshPlugin from "phaser-navmesh";
import { EventEnum, reactEvents } from "../../../events/EventsCenter";
import FollowerSprite from "../../../games/follower";
import { createCharacterAnims, createLizardAnims } from "../../anims/RpgAnims";
import { NavAlien } from "./player/NavAlien";
import { NavPlayer } from "./player/NavPlayer";

export default class NavMeshTestScene extends Phaser.Scene {
  navMeshPlugin: PhaserNavMeshPlugin;
  private playerRpg;
  private aliens!: Phaser.Physics.Arcade.Group;

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
    const navMesh = this.navMeshPlugin.buildMeshFromTiled(
      "mesh1",
      objectLayer,
      12.5
    );
    const graphics = this.add.graphics({ x: 0, y: 0 }).setAlpha(0.5);
    navMesh.enableDebug(graphics);

    const players = this.physics.add.group({
      classType: NavPlayer,
    });
    this.playerRpg = players.get(300, 250, "player");
    this.playerRpg.setNavMesh(navMesh);
    this.physics.add.collider(this.playerRpg, wallLayer);

    this.aliens = this.physics.add.group({
      classType: NavAlien,
    });
    let alien1 = this.aliens.get(20, 30, "lizard");
    alien1.setNavMesh(navMesh);
    let alien2 = this.aliens.get(50, 680, "lizard");
    alien2.setNavMesh(navMesh);
    // const follower = new FollowerSprite(this, 50, 200, navMesh);

    const hearts = this.add.group({
      // once a heart is removed, it's added to the pool
      removeCallback: function (heart) {},
    });
    let hrt = this.physics.add.sprite(40, 50, "heart");
    hearts.add(hrt);

    this.input.on("pointerdown", (pointer) => {
      const start = new Phaser.Math.Vector2(this.playerRpg.x, this.playerRpg.y);
      const end = new Phaser.Math.Vector2(pointer.x, pointer.y);
      this.playerRpg.goTo(end);
    });

    this.physics.add.overlap(this.playerRpg, hearts, function (player, hrt) {
      console.log(player, hrt);
      hearts.killAndHide(hrt);
      hearts.remove(hrt);
    });
  }

  private handlePlayerUpdated(playerInfo) {
    this.playerRpg.updateCharacter(playerInfo.name);
  }

  public update(_time: number, delta: number) {
    const cursors = this.input.keyboard.createCursorKeys();
    const keyR = this.input.keyboard.addKey("R");
    this.playerRpg.update(cursors, keyR, delta);
  }
}
