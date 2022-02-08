import { Lizard } from "../../characters/Lizard";
import Player from "../../characters/Player";
import { PlayerRpg } from "../../characters/PlayerRpg";

export default class RpgGame extends Phaser.Scene {
  private playerSprite;
  constructor() {
    super("game");
  }

  public preload() {
    this.load.image("tiles", "assets/rpggame/cloud_tileset.png");
    this.load.tilemapTiledJSON(
      "cloud-city-map",
      "assets/rpggame/cloud_city.json"
    );
    this.load.spritesheet("player", "assets/rpggame/characters.png", {
      frameWidth: 26,
      frameHeight: 36,
    });

    this.load.atlas(
      "lizard",
      "assets/rpggame/lizard.png",
      "assets/rpggame/lizard.json"
    );
  }

  public create() {
    const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
    const tileset = cloudCityTilemap.addTilesetImage("Cloud City", "tiles");
    const groundLayer = cloudCityTilemap.createLayer("ground", tileset);
    groundLayer.scale = 2;
    const wallsLayer = cloudCityTilemap.createLayer("walls", tileset);
    wallsLayer.scale = 2;
    wallsLayer.setCollisionByProperty({ collides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.3);
    wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 243, 48, 255),
      faceColor: new Phaser.Display.Color(48, 39, 37, 255),
    });

    const players = this.physics.add.group({
      classType: PlayerRpg,
    });
    this.playerSprite = players.get(250, 250, "player");

    const lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizGo = go as Lizard;
        lizGo.body.onCollide = true;
      },
    });
    lizards.get(452, 350, "lizard");

    this.physics.add.collider(this.playerSprite, wallsLayer);
    this.physics.add.collider(lizards, wallsLayer);

    this.physics.add.collider(
      lizards,
      this.playerSprite,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
  }

  private handlePlayerLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const lizard = obj2 as Lizard;
    const dx = this.playerSprite.x - lizard.x;
    const dy = this.playerSprite.y - lizard.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    this.playerSprite.handleDamage(dir);
  }

  public update(_time: number, delta: number) {
    const cursors = this.input.keyboard.createCursorKeys();
    this.playerSprite.update(cursors);
  }
}
