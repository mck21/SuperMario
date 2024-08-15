import { createAnimations } from "./animations.js";
import { initAudio, playAudio } from "./audio.js";
import { checkControls } from "./controls.js";
import { initSpritesheet } from "./spritesheet.js";

const config = {
    type: Phaser.AUTO,
    width: 256,
    height: 244,
    backgroundColor: "#049cd8",
    parent: "game",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
}

var game = new Phaser.Game(config);

function preload() {
    this.load.image(
        "cloud1",
        "assets/scenery/overworld/cloud1.png"
    )

    this.load.image(
        "floorbricks",
        "assets/scenery/overworld/floorbricks.png"
    )

    initSpritesheet(this)

    initAudio(this)

}

function create() {
    createAnimations(this)

    this.add.image(100, 50, "cloud1")
        .setOrigin(0, 0)
        .setScale(0.15)

    this.floor = this.physics.add.staticGroup()

    this.floor.create(0, config.height - 32, "floorbricks")
        .setOrigin(0, 0)
        .refreshBody()

    this.floor.create(160, config.height - 32, "floorbricks")
        .setOrigin(0, 0)
        .refreshBody()

    this.mario = this.physics.add.sprite(50, 100, "mario")
        .setOrigin(0, 1)
        .setGravityY(200)
        .setCollideWorldBounds(true)

    this.enemy = this.physics.add.sprite(100, config.height - 64, "goomba")
        .setOrigin(0, 1)
        .setVelocityX(-30)

    this.coins = this.physics.add.staticGroup()
    this.coins.create(200, config.height - 48, "coin").anims.play("coin-spin", true)
    this.coins.create(220, config.height - 48, "coin").anims.play("coin-spin", true)
    this.coins.create(240, config.height - 48, "coin").anims.play("coin-spin", true)
    this.coins.create(260, config.height - 48, "coin").anims.play("coin-spin", true)

    this.physics.add.overlap(this.mario, this.coins, takeCoin, null, this)


    this.physics.world.setBounds(0, 0, 2000, config.height)
    this.physics.add.collider(this.mario, this.floor)
    this.physics.add.collider(this.enemy, this.floor)
    this.physics.add.collider(this.coins, this.floor)
    this.physics.add.collider(this.mario, this.enemy, onEnemyCollide, null, this)

    this.cameras.main.setBounds(0, 0, 2000, config.height)
    this.cameras.main.startFollow(this.mario)

    this.enemy.anims.play("goomba-walk", true)

    this.keys = this.input.keyboard.createCursorKeys()
}



function update() {
    const { mario } = this

    checkControls(this)


    //check if mario is dead
    if (mario.y >= config.height) {
        marioDeath(this)
    }
}

function addToScore(scoreToAdd, origin, game) {
    const scoreText = game.add.text(origin.x, origin.y, scoreToAdd, {
        fontSize: "6px",
        fontFamily: "pixel",
        color: "#fff"
    })

    game.tweens.add({
        targets: scoreText,
        y: scoreText.y - 20,
        alpha: 0,
        duration: 800,
        onComplete: () => {
            scoreText.destroy()
        }
    })
}

function takeCoin(mario, coin) {
    coin.destroy()
    playAudio("coin", this, { volume: .1 })

    addToScore(100, coin, this)
}


function onEnemyCollide(mario, enemy) {
    if (mario.body.touching.down && enemy.body.touching.up) {
        enemy.anims.play("goomba-dead", true);

        playAudio("goomba-stomp", this)
        addToScore(200, mario, this)

        enemy.setVelocityX(0);
        mario.setVelocityY(-200);
        mario.setVelocityX(0);
        setTimeout(() => {
            enemy.destroy()
        }, 500)
    } else {
        marioDeath(this)
    }
}

function marioDeath(game) {
    const { mario, scene } = game

    if (mario.isDead) return

    mario.isDead = true
    mario.anims.play("mario-dead", true)
    mario.setCollideWorldBounds(false)

    playAudio("gameover", game, { volume: .2 })

    mario.body.checkCollision.none = true
    mario.setVelocityX(0)

    setTimeout(() => {
        mario.setVelocityY(-250)
    }, 100)

    setTimeout(() => {
        scene.restart()
    }, 2000)
}