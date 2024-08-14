import { createAnimations } from "./animations.js";
import { checkControls } from "./controls.js";

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

    this.load.spritesheet(
        "mario",
        "assets/entities/mario.png",
        { frameWidth: 18, frameHeight: 16 }
    )

    this.load.spritesheet(
        "goomba",
        "assets/entities/overworld/goomba.png",
        { frameWidth: 16, frameHeight: 16 }
    )

    this.load.audio(
        "gameover",
        "assets/sound/music/gameover2.mp3"
    )

    this.load.audio(
        "goomba-stomp",
        "assets/sound/effects/goomba-stomp.wav"
    )
    
}

function create() {
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


    this.physics.world.setBounds(0, 0, 2000, config.height)
    this.physics.add.collider(this.mario, this.floor)
    this.physics.add.collider(this.enemy, this.floor)
    this.physics.add.collider(this.mario, this.enemy, onEnemyCollide, null, this)

    this.cameras.main.setBounds(0, 0, 2000, config.height)
    this.cameras.main.startFollow(this.mario)

    createAnimations(this)

    this.enemy.anims.play("goomba-walk", true)

    this.keys = this.input.keyboard.createCursorKeys()
}

function onEnemyCollide(mario, enemy) {
    if (mario.body.touching.down && enemy.body.touching.up) {
        enemy.anims.play("goomba-dead", true);
        this.sound.play("goomba-stomp", { volume: 0.2 })
        enemy.setVelocityX(0);        
        mario.setVelocityY(-200);
        mario.setVelocityX(0);
        setTimeout(() => {
            enemy.destroy()
        }, 500)
    } else {
    }
}

function update() {
    checkControls(this)

    const { mario, sound, scene } = this

    //check if mario is dead
    if (mario.y >= config.height) {
        mario.isDead = true
        mario.anims.play("mario-dead", true)
        mario.setCollideWorldBounds(false)
        sound.play("gameover", { volume: 0.2 })

        setTimeout(() => {
            mario.setVelocityY(-350)
        }, 100)

        setTimeout(() => {
            scene.restart()
        }, 1600)
    }
}