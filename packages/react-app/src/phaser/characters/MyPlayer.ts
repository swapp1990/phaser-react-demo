import Phaser from 'phaser'
import Player from './Player'

export default class MyPlayer extends Player {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, id, frame)
    // this.playContainerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body
  }

  update(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  ) {
    if (!cursors) return
    const speed = 200
    let vx = 0
    let vy = 0
    if (cursors.left?.isDown) vx -= speed
    if (cursors.right?.isDown) vx += speed
    if (cursors.up?.isDown) {
      vy -= speed
      this.setDepth(this.y) //change player.depth if player.y changes
    }
    if (cursors.down?.isDown) {
      vy += speed
      this.setDepth(this.y) //change player.depth if player.y changes
    }
    // update character velocity, Needs enableBody on sprite
    this.setVelocity(vx, vy)
    if (vx > 0) {
      this.play(`${this.playerTexture}_run_right`, true)
    } else if (vx < 0) {
      this.play(`${this.playerTexture}_run_left`, true)
    } else if (vy > 0) {
      this.play(`${this.playerTexture}_run_down`, true)
    } else if (vy < 0) {
      this.play(`${this.playerTexture}_run_up`, true)
    } else {
      const parts = this.anims.currentAnim.key.split('_')
      parts[1] = 'idle'
      const newAnim = parts.join('_')
      // this prevents idle animation keeps getting called
      if (this.anims.currentAnim.key !== newAnim) {
        this.play(parts.join('_'), true)
      }
    }
  }
}

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      myPlayer(x: number, y: number, texture: string, id: string, frame?: string | number): MyPlayer
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'myPlayer',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    id: string,
    frame?: string | number
  ) {
    const sprite = new MyPlayer(this.scene, x, y, texture, id, frame)

    this.displayList.add(sprite)
    this.updateList.add(sprite)

    //enables setVelocity
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY)

    return sprite
  }
)
