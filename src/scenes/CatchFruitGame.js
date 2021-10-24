import Phaser, { Math } from "phaser"
import getMouseSpot from "../firstGameSystem/getMouseSpot"
import Score from "../firstGameSystem/ScoreText"
import DropTimeCounter from "../firstGameSystem/DropTimeCounter"
import BombSpawner from "../firstGameSystem/BombSpawner"
import StarsSpawner from "../firstGameSystem/StarsSpawner"
import GameTimer from "../firstGameSystem/GameTimer"

const BombKey = 'bomb'
const StarKey = 'star'
/* G:\FCU\大專生報告\20210705後\Games\phaser3-parcel-template-master
   npm run start
*/
export default class CatchFruitGame extends Phaser.Scene{


    constructor(){
        super("catch-fruit")
        this.player = undefined
        this.cursor = undefined
        this.stars = undefined
        this.scoreText = undefined
        this.bombsGroup = undefined
        this.starsGroup = undefined
        this.gameOver = false
    }

    preload(){
        this.load.image('sky','src/assets/sky.png');
        this.load.image('ground','src/assets/platform.png');
        this.load.image('star','src/assets/star.png');
        this.load.image('bomb','src/assets/bomb.png');
        this.load.spritesheet('dude','src/assets/dude.png',{
            frameWidth: 32, frameHeight:48
        });

    }

    create(){
        this.add.image(400,300,'sky')
        this.platforms = this.createPlatform()
        this.player = this.createPlayer()
        this.cursor = this.input.keyboard.createCursorKeys()
        this.starsSpawner = new StarsSpawner(this,StarKey)
        this.starsGroup = this.starsSpawner.group
        this.bombSpawner = new BombSpawner(this,BombKey)
        this.bombsGroup = this.bombSpawner.groupA

        this.starsSpawner.spawn()
        this.scoreText = this.createScoreText(16,16,0)

        /* related to collider between objects */
        this.physics.add.collider(this.player,this.platforms)
        this.physics.add.overlap(this.player, this.starsGroup, this.collectStar,null,this)
        this.physics.add.collider(this.platforms, this.starsGroup,this.disableBody,null,this)
        this.physics.add.collider(this.platforms, this.bombsGroup, this.hitBomb,null,this)
        this.physics.add.collider(this.player, this.bombsGroup, this.hitBomb, null, this)

        /* related to time*/
        const timerLabel = this.add.text(16, 54, 'timeLabel : ', {fontSize:32,fill:'#000'})
        this.starCoolDown = new DropTimeCounter(this,timerLabel)
        this.starCoolDown.start(this.handleCountDownFinished.bind(this),500)//5s


        const timerLabel2 = this.add.text(16, 90, 'timeLabel2 : ', {fontSize:32,fill:'#000'})
        this.gameTimer = new GameTimer(this,timerLabel2)
        this.gameTimer.start(this.gameover.bind(this),10000)//5s

        /* get now mouse spot*/
        const MouseLabel = this.add.text(10, 578, 'spot : ', {fontSize:16,fill:'#000'})
        this.MouseSpot = new getMouseSpot(this, MouseLabel)
        this.input.on('pointermove',function(pointer){
            this.MouseSpot.get(pointer)
        },this)
    }

    handleCountDownFinished(){
        this.starsSpawner.spawn()
    }

    gameover(){
        this.physics.pause()
        this.starCoolDown.stop()
        this.player.setTint(0xff0000)
        this.player.anims.play('stop')
        this.gameOver = true
    }

    disableBody(hit,disablePart){   //碰撞後決定消失的物件（右邊）
        disablePart.disableBody(true,true)
    }

    hitBomb(player,bomb){
        // bomb.disableBody(true,true)
    }

    createScoreText(x,y,score){
        const style = {fontSize:'32px', fill:'#000'}
        const label = new Score(this,x,y,score,style)
        this.add.existing(label)
        return label
    }

    collectStar(player,star){
        star.disableBody(true,true)
        console.log(this.starsSpawner.getNumber())
        this.scoreText.addScore(10)
    }

    createPlatform(){
        const platforms = this.physics.add.staticGroup()
        platforms.create(400,568,'ground').setScale(2).refreshBody()

        return platforms
    }

    createPlayer(){
        const player = this.physics.add.sprite(400,515,'dude')
        player.setCollideWorldBounds(true)
        this.anims.create({
            key: 'goLeft',
            frames: this.anims.generateFrameNumbers('dude',{ start: 0,end: 3 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'goRight',
            frames: this.anims.generateFrameNumbers('dude',{ start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'stop',
            frames: [{key:'dude', frame:4}],
            frameRate: 20
        })
        return player
    }

    update(){
        if(this.gameOver == true){
            return
        }

        if(this.cursor.left.isDown){
            this.player.setVelocityX(-400)
            this.player.anims.play('goLeft',true)
        }else if(this.cursor.right.isDown){
            this.player.setVelocityX(400)
            this.player.anims.play('goRight',true)
        }else{
            this.player.setVelocityX(0)
            this.player.anims.play('stop',true)
        }

        if(this.cursor.up.isDown && this.player.body.touching.down){
            this.player.setVelocityY(-120)
        }

        this.starCoolDown.update()
        this.gameTimer.update()
    }
}