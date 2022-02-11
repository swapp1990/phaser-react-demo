enum Direction {
  NONE = "none",
  LEFT = "left",
  UP = "up",
  RIGHT = "right",
  DOWN = "down",
}

const createCharacterAnims = (anims: Phaser.Animations.AnimationManager) => {
  function createPlayerAnimation(
    anims: Phaser.Animations.AnimationManager,
    name: string,
    startFrame: number,
    endFrame: number
  ) {
    anims.create({
      key: name,
      frames: anims.generateFrameNumbers("player", {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true,
    });
  }

  createPlayerAnimation(anims, Direction.UP, 90, 92);
  createPlayerAnimation(anims, Direction.RIGHT, 78, 80);
  createPlayerAnimation(anims, Direction.DOWN, 54, 56);
  createPlayerAnimation(anims, Direction.LEFT, 66, 68);
};

const updateCharacterAnims = (anims, characterObj) => {
  function createPlayerAnimation(
    anims: Phaser.Animations.AnimationManager,
    name: string,
    startFrame: number,
    endFrame: number
  ) {
    anims.create({
      key: name,
      frames: anims.generateFrameNumbers("player", {
        start: startFrame,
        end: endFrame,
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true,
    });
  }

  characterObj.anims.forEach((anim) => {
    anims.remove(anim.name);
    createPlayerAnimation(anims, anim.name, anim.start, anim.end);
  });
};

const createLizardAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "lizard-idle",
    frames: anims.generateFrameNames("lizard", {
      start: 0,
      end: 3,
      prefix: "lizard_m_idle_anim_f",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 10,
  });
  anims.create({
    key: "lizard-run",
    frames: anims.generateFrameNames("lizard", {
      start: 0,
      end: 5,
      prefix: "lizard_m_run_anim_f",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 10,
  });
};

const createChestAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: "chest-open",
    frames: anims.generateFrameNames("treasure", {
      start: 0,
      end: 2,
      prefix: "chest_empty_open_anim_f",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 5,
  });
  anims.create({
    key: "chest-closed",
    frames: [
      {
        key: "treasure",
        frame: "chest_empty_open_anim_f0.png",
      },
    ],
    repeat: -1,
  });
};

export {
  createCharacterAnims,
  updateCharacterAnims,
  createLizardAnims,
  createChestAnims,
};
