export function checkControls ({ mario, keys }) {
    const isLeftKeyDown = keys.left.isDown
    const isRightKeyDown = keys.right.isDown
    const isUpKeyDown = keys.up.isDown
    const isMarioTouchingDown = mario.body.touching.down

    if (mario.isDead) return
    if (isLeftKeyDown) {
        mario.x -= 2
        mario.anims.play("mario-walk", true)
        mario.flipX = true
    } else if (isRightKeyDown) {
        mario.x += 2
        mario.anims.play("mario-walk", true)
        mario.flipX = false
    } else {
        mario.anims.stop()
        mario.anims.play("mario-idle", true)
    }

    if (!isMarioTouchingDown) {
        mario.anims.play("mario-jump", true)
    }

    if (isUpKeyDown) {
        if (isMarioTouchingDown){
            mario.setVelocityY(-200)
        }        
    }
}