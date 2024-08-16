export const createAnimations = (game) => {
    game.anims.create({
        key: "mario-walk",
        frames: game.anims.generateFrameNumbers("mario", { start: 1, end: 3 }),
        frameRate: 10,
        repeat: -1
    })

    game.anims.create({
        key: "mario-idle",
        frames: [{ key: "mario", frame: 0 }],
        frameRate: 10,
        repeat: -1
    })

    game.anims.create({
        key: "mario-jump",
        frames: [{ key: "mario", frame: 5 }]
    })

    game.anims.create({
        key: "mario-dead",
        frames: [{ key: "mario", frame: 4 }]
    })

    game.anims.create({
        key: "superMario-idle",
        frames: [{ key: "superMario", frame: 0 }],
        frameRate: 10,
        repeat: -1
    })

    game.anims.create({
        key: "superMario-walk",
        frames: game.anims.generateFrameNumbers("superMario", { start: 1, end: 3 }),
        frameRate: 10,
        repeat: -1
    })

    game.anims.create({
        key: "superMario-jump",
        frames: [{ key: "superMario", frame: 5 }]       
    })

    game.anims.create({
        key: "goomba-walk",
        frames: game.anims.generateFrameNumbers("goomba", { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1
    })

    game.anims.create({
        key: "goomba-dead",
        frames: [{ key: "goomba", frame: 2 }]
    })

    game.anims.create({
        key: "coin-spin",
        frames: game.anims.generateFrameNumbers("coin", { start: 0, end: 3 }),
        frameRate: 6,
        repeat: -1
    })
}