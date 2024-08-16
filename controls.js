
const MARIO_ANIMS = {
    normal: {
        idle: "mario-idle",
        walk: "mario-walk",
        jump: "mario-jump"
    },
    super: {
        idle: "superMario-idle",
        walk: "superMario-walk",
        jump: "superMario-jump"
    },
}
export function checkControls({ mario, keys }) {
    const isLeftKeyDown = keys.left.isDown
    const isRightKeyDown = keys.right.isDown
    const isUpKeyDown = keys.up.isDown
    const isMarioTouchingDown = mario.body.touching.down

    if (mario.isDead) return
    if (mario.isBlocked) return

    const marioAnims = mario.isSuper ? MARIO_ANIMS.super : MARIO_ANIMS.normal

    if (isLeftKeyDown) {
        mario.x -= 2
        mario.anims.play(marioAnims.walk, true)
        mario.flipX = true
    } else if (isRightKeyDown) {
        mario.x += 2
        mario.anims.play(marioAnims.walk, true)
        mario.flipX = false
    } else {
        mario.anims.stop()
        mario.anims.play(marioAnims.idle, true)
    }

    if (!isMarioTouchingDown) {
        mario.anims.play(marioAnims.jump, true)
    }

    if (isUpKeyDown) {
        if (isMarioTouchingDown) {
            mario.setVelocityY(-200)
        }
    }
}