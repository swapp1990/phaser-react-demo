import { createCharacterAnims, createLizardAnims } from "../../anims/RpgAnims";
import { Lizard } from "../../characters/Lizard";
import Player from "../../characters/Player";
import { PlayerRpg } from "../../characters/PlayerRpg";
import { sceneEvents } from "../../events/EventsCenter";

export default class RpgGame extends Phaser.Scene {
  private playerSprite;
  private playerLizardCollider?: Phaser.Physics.Arcade.Collider;
  private knives!: Phaser.Physics.Arcade.Group;
  private lizards!: Phaser.Physics.Arcade.Group;

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

    this.load.image("ui-heart-full", "assets/rpggame/ui_heart_full.png");
    this.load.image("ui-heart-empty", "assets/rpggame/ui_heart_empty.png");

    this.load.image("knife", "assets/rpggame/weapon_knife.png");
  }

  public create() {
    this.scene.run("game-ui");

    createLizardAnims(this.anims);
    createCharacterAnims(this.anims);

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

    this.lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (go) => {
        const lizGo = go as Lizard;
        lizGo.body.onCollide = true;
      },
    });
    this.lizards.get(452, 350, "lizard");

    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });
    this.playerSprite.setKnives(this.knives);

    this.physics.add.collider(this.playerSprite, wallsLayer);
    this.physics.add.collider(this.lizards, wallsLayer);
    this.physics.add.collider(
      this.knives,
      wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeLizardCollision,
      undefined,
      this
    );

    this.playerLizardCollider = this.physics.add.collider(
      this.lizards,
      this.playerSprite,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
  }

  private handleKnifeWallCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
  }

  private handleKnifeLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
    this.lizards.killAndHide(obj2);
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
    sceneEvents.emit("player-health-changed", this.playerSprite.health);

    if (this.playerSprite.health <= 0) {
      this.playerLizardCollider?.destroy();
    }
  }

  public update(_time: number, delta: number) {
    const cursors = this.input.keyboard.createCursorKeys();
    this.playerSprite.update(cursors);
  }
}
