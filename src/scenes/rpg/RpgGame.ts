import {
  createCharacterAnims,
  createChestAnims,
  createLizardAnims,
} from "../../anims/RpgAnims";
import { Lizard } from "../../characters/Lizard";
import Player from "../../characters/Player";
import { PlayerRpg } from "../../characters/PlayerRpg";
import { EventEnum, reactEvents, sceneEvents } from "../../events/EventsCenter";
import { Chest } from "../../items/Chest";
import Computer from "../../items/Computer";

export default class RpgGame extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private playerRpg;
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

    this.load.atlas(
      "treasure",
      "assets/rpggame/treasure.png",
      "assets/rpggame/treasure.json"
    );

    this.load.image("ui-heart-full", "assets/rpggame/ui_heart_full.png");
    this.load.image("ui-heart-empty", "assets/rpggame/ui_heart_empty.png");

    this.load.image("knife", "assets/rpggame/weapon_knife.png");

    this.load.spritesheet("computers", "assets/rpggame/computer.png", {
      frameWidth: 96,
      frameHeight: 64,
    });
  }

  public create() {
    reactEvents.on(EventEnum.PLAYER_UPDATED, this.handlePlayerUpdated, this);

    this.scene.run("game-ui");

    createLizardAnims(this.anims);
    createCharacterAnims(this.anims);
    createChestAnims(this.anims);

    this.map = this.make.tilemap({ key: "cloud-city-map" });
    const tileset = this.map.addTilesetImage("Cloud City", "tiles");
    const groundLayer = this.map.createLayer("ground", tileset);
    groundLayer.scale = 2;
    const wallsLayer = this.map.createLayer("walls", tileset);
    wallsLayer.scale = 2;
    wallsLayer.setCollisionByProperty({ collides: true });

    const chests = this.physics.add.staticGroup({
      classType: Chest,
    });
    const chestsLayer = this.map.getObjectLayer("Chests");

    chestsLayer.objects.forEach((chestObj) => {
      chests.get(
        chestObj.x! * 2,
        chestObj.y! * 2,
        "treasure",
        "chest_empty_open_anim_f0.png"
      );
    });

    const debugGraphics = this.add.graphics().setAlpha(0.3);
    wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 243, 48, 255),
      faceColor: new Phaser.Display.Color(48, 39, 37, 255),
    });

    // const chest = this.add.sprite(
    //   64,
    //   64,
    //   "treasure",
    //   "chest_empty_open_anim_f0.png"
    // );
    // this.time.delayedCall(1000, () => {
    //   chest.play("chest-open");
    // });

    const players = this.physics.add.group({
      classType: PlayerRpg,
    });
    this.playerRpg = players.get(350, 250, "player");

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
    this.playerRpg.setKnives(this.knives);

    const computers = this.physics.add.staticGroup({ classType: Computer });
    const computerLayer = this.map.getObjectLayer("Computer");
    computerLayer.objects.forEach((obj, i) => {
      const item = this.addObjectFromTiled(
        computers,
        obj,
        "computers",
        "computer"
      ) as Computer;
    });

    this.physics.add.collider(this.playerRpg, wallsLayer);
    this.physics.add.collider(
      this.playerRpg,
      chests,
      this.handlePlayerChestCollision,
      undefined,
      this
    );
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

    this.physics.add.overlap(
      this.playerRpg,
      [computers],
      this.handleItemSelectorOverlap,
      undefined,
      this
    );

    this.playerLizardCollider = this.physics.add.collider(
      this.lizards,
      this.playerRpg,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
  }

  private addObjectFromTiled(
    group: Phaser.Physics.Arcade.StaticGroup,
    object: Phaser.Types.Tilemaps.TiledObject,
    key: string,
    tilesetName: string
  ) {
    const actualX = object.x! + object.width! * 0.5;
    const actualY = object.y! - object.height! * 0.5;
    const obj = group
      .get(
        actualX,
        actualY,
        key,
        object.gid! - this.map.getTileset(tilesetName).firstgid
      )
      .setDepth(actualY);
    return obj;
  }

  private handlePlayerUpdated(playerInfo) {
    // console.log("handlePlayerUpdated ", playerInfo);
    this.playerRpg.updateCharacter(playerInfo.name);
  }

  private handleItemSelectorOverlap(playerSelector, selectionItem) {
    // console.dir(playerSelector);
    // console.dir(selectionItem);
    const currentItem = playerSelector.selectedItem;
    if (currentItem) {
      currentItem.clearDialogBox();
    }
    playerSelector.selectedItem = selectionItem;
    selectionItem.onOverlapDialog();
  }

  private handlePlayerChestCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    // console.dir(obj2);
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
    const dx = this.playerRpg.x - lizard.x;
    const dy = this.playerRpg.y - lizard.y;
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    this.playerRpg.handleDamage(dir);
    sceneEvents.emit("player-health-changed", this.playerRpg.health);

    if (this.playerRpg.health <= 0) {
      this.playerLizardCollider?.destroy();
    }
  }

  public update(_time: number, delta: number) {
    const cursors = this.input.keyboard.createCursorKeys();
    const keyR = this.input.keyboard.addKey("R");
    this.playerRpg.update(cursors, keyR);
  }
}
