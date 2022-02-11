import Phaser from 'phaser'

export default class Background extends Phaser.Scene {
    private backdropKey!: string
    constructor() {
        super('background')
    }
    preload() {
        console.log("preload Background")
    }
    init() {

    }
    create() {
        const sceneHeight = this.cameras.main.height
        const sceneWidth = this.cameras.main.width
        this.backdropKey = 'backdrop_day'
        // console.log(sceneHeight, sceneWidth)
        this.cameras.main.setBackgroundColor('#c6eefc')
        const backdropImage = this.add.image(sceneWidth / 2, sceneHeight / 2, this.backdropKey)
        const scale = Math.max(sceneWidth / backdropImage.width, sceneHeight / backdropImage.height)
        backdropImage.setScale(scale).setScrollFactor(0)
    }
}