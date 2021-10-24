import Phaser from "phaser";
import ScoreLabel from "~/Games/firstGameSystem/ScoreLabel";
import BombSpawner from "~/Games/firstGameSystem/BombSpawner";


const Ground = 'ground' //'ground' autocompletion method
const BombKey = 'bomb'

export default class MyFirstGameScene extends Phaser.Scene
{
    constructor(){
        super("game-scene")
        this.player = undefined
        this.cursors = undefined
        this.scoreLabel = undefined
        this.bombSpawner =undefined
        this.stars = undefined

        this.gameOver = false
    }
//cd phaser3-parcel-template-master
//npm run start
    preload(){
        this.load.image('sky','../assets/sky.png')
        this.load.image( 'ground' ,'../assets/platform.png')
        this.load.image('star','../assets/star.png')
        this.load.image(BombKey,'../assets/bomb.png')

        this.load.spritesheet('dude',
            './assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        )
    }

    create(){
        this.add.image(400,300,'sky')
        const platforms = this.createPlatforms()
        this.player = this.createPlayer()

        this.stars = this.createStars()
        this.scoreLabel = this.createScoreLabel(16,16,0)
        this.bombSpawner = new BombSpawner(this,BombKey)
        const bombsGroup = this.bombSpawner.group

        this.cursors = this.input.keyboard.createCursorKeys()
        this.physics.add.collider(this.stars, platforms)
        this.physics.add.collider(this.player, platforms)
        this.physics.add.collider(bombsGroup, platforms)
        this.physics.add.collider(this.player, bombsGroup, this.hitBomb, null, this)
        this.physics.add.overlap(this.player, this.stars,this.collectStar,null,this)
    }

    collectStar(player,star){
        star.disableBody(true,true)
        this.scoreLabel.add(10)

        if(this.stars.countActive(true) === 0){
            // A new batch of stars to collect
            this.stars.children.iterate((child) => {
                child.enableBody(true, child.x, 0, true, true)
            })
        }
        this.bombSpawner.spawn(player.x)
    }

    createScoreLabel(x, y, score){
        const style = { fontSize: '32px', fill: '#000'}
        const label = new ScoreLabel(this, x, y, score, style)

        this.add.existing(label)

        return label
    }

    createStars(){
        const stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70}
        })

        stars.children.iterate((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.1,0.4))
        })

        return stars
    }

    createPlatforms(){
        const platforms = this.physics.add.staticGroup()
        platforms.create(400,568,'ground').setScale(2).refreshBody()
        platforms.create(600,400,'ground')
        platforms.create(50,250,'ground')
        platforms.create(750,220,'ground')

        return platforms
    }

    createPlayer(){
        const player = this.physics.add.sprite(100, 450, 'dude')
        player.setBounce(0.1)
        player.setCollideWorldBounds(true) //help object to not go ouside the world

        this.anims.create({
            key: 'goLeft',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}) ,
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'goRight',
            frames: this.anims.generateFrameNumbers('dude',{start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'stop',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        })

        return player
    }


    update(){
        if(this.gameOver){
            return
        }

        if(this.cursors.left.isDown){
            this.player.setVelocityX(-250)
            this.player.anims.play('goLeft',true)
        }else if(this.cursors.right.isDown){
            this.player.setVelocityX(250)
            this.player.anims.play('goRight',true)
        }else{
            this.player.setVelocityX(0)
            this.player.anims.play('stop',true)
        }

        if(this.cursors.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-250)
        }
    }

    hitBomb(player, bomb){
        this.physics.pause()

        player.setTint(0xff0000)
        player.anims.play('stop')
        this.gameOver = true
    }

}