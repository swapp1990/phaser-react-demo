import Phaser from 'phaser'

export default class Bootstrap extends Phaser.Scene {
    constructor() {
        super('bootstrap')
    }
    preload() {
        console.log("preload Bootstrap")
        this.load.image('backdrop_day', 'assets/background/backdrop_day.png')
        this.load.tilemapTiledJSON('tilemap', 'assets/map/map.json')
        this.load.spritesheet('tiles_wall', 'assets/map/FloorAndGround.png', {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet('adam', 'assets/character/adam.png', {
            frameWidth: 32,
            frameHeight: 48,
        })
    }
    init() {

    }
    create() {
        this.launchGame()
        this.launchBackground()
    }
    private launchBackground() {
        this.scene.launch('background')
    }
    launchGame() {
        this.scene.launch('game')
    }
}