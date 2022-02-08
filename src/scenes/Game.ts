import Phaser from 'phaser'
import { createCharacterAnims } from '../anims/CharacterAnims'
import '../characters/MyPlayer'
import MyPlayer from '../characters/MyPlayer'

export default class Game extends Phaser.Scene {
    private map!: Phaser.Tilemaps.Tilemap
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    myPlayer!: MyPlayer

    constructor() {
        super('game')
    }
    preload() {
        console.log("preload Game")
    }
    init() {

    }
    registerKeys() {
        this.cursors = this.input.keyboard.createCursorKeys()
    }
    create() {
        this.registerKeys();
        createCharacterAnims(this.anims)
        this.map = this.make.tilemap({ key: 'tilemap' })
        const FloorAndGround = this.map.addTilesetImage('FloorAndGround', 'tiles_wall')

        const groundLayer = this.map.createLayer('Ground', FloorAndGround)
        groundLayer.setCollisionByProperty({ collides: true })

        this.myPlayer = this.add.myPlayer(705, 500, 'adam', '0')

        this.cameras.main.zoom = 1.5
        this.cameras.main.startFollow(this.myPlayer, true)

        this.physics.add.collider([this.myPlayer], groundLayer )
    }

    update(t: number, dt: number) {
        if (this.myPlayer) {
            this.myPlayer.update(this.cursors);
        }
    }
}