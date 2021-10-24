import Phaser from 'phaser';
import config from './config';
import CatchFruitGame from './scenes/CatchFruitGame'
import ShootingGame from './scenes/ShootingGame'
import CookingGame from './scenes/CookingGame'

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.start('bangbangShooting');
  }
}

const game = new Game(); /* eslint-disable-line */
