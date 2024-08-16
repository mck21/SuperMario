import { createAnimations } from "./animations.js";
import { initAudio, playAudio } from "./audio.js";
import { checkControls } from "./controls.js";
import { initImages } from "./images.js";
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
    initImages(this)
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

    this.collectibles = this.physics.add.staticGroup()

    // Coins
    this.collectibles.create(200, config.height - 48, "coin").anims.play("coin-spin", true)
    this.collectibles.create(220, config.height - 48, "coin").anims.play("coin-spin", true)
    this.collectibles.create(240, config.height - 48, "coin").anims.play("coin-spin", true)
    this.collectibles.create(260, config.height - 48, "coin").anims.play("coin-spin", true)

    // Super Mushroom
    this.collectibles.create(300, config.height - 40, "superMushroom")

    this.physics.add.overlap(this.mario, this.collectibles, takeItem, null, this)


    this.physics.world.setBounds(0, 0, 2000, config.height)
    this.physics.add.collider(this.mario, this.floor)
    this.physics.add.collider(this.enemy, this.floor)
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

function takeItem(mario, item) {
    const { texture: { key } } = item
    item.destroy()
    if (key === "coin") {
        playAudio("coin", this, { volume: .1 })
        addToScore(100, item, this)
    } else if (key === "superMushroom") {
        this.physics.world.pause()
        this.anims.pauseAll()

        playAudio("powerup", this, { volume: .2 })        

        let i = 0
        const interval = setInterval(() => {
            i++
            mario.anims.play(i % 2 === 0 ? "superMario-idle" : "mario-idle", true)            
        }, 100)

        mario.isBlocked = true        
        mario.isSuper = true

        setTimeout(() => {
            mario.isBlocked = false

            mario.setDisplaySize(18, 32)
            mario.body.setSize(18, 32)

            clearInterval(interval)
            this.physics.world.resume()
            this.anims.resumeAll()
        }, 1000)
    }
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