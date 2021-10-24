
import Phaser from 'phaser'
// import HelloWorldScene from './scenes/HelloWorldScene'
// import MyFirstGameScene from './scenes/MyFirstGameScene'
import CatchFruitGame from './scenes/CatchFruitGame'
import ShootingGame from './scenes/ShootingGame'
import CookingGame from './scenes/CookingGame'
const change = require('./static/js/change')
// console.log( changeScene())
let config = {
	type: Phaser.AUTO,
	width: change.changeW(),
	height: 600,
	autoCenter: Phaser.Scale.CENTER_BOTH,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true,
		}
	},
	//scene: [CookingGame,CatchFruitGame,ShootingGame]

}
console.log(change)
// function changeW(){
// 	config.width = 1000
// }

export default new Phaser.Game(config)
//module.export = changeW
