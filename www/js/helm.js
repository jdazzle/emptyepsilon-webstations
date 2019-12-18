const network = require('../network.js');

let playerShipArrow;

class RadarScene extends Phaser.Scene {

    constructor () {
        super('RadarScene');
    }

    preload () {
    
        this.load.setPath('assets');

        this.load.image('RadarArrow', 'images/RadarArrow.png');

    }

    create () {

        playerShipArrow = this.add.image(960, 540, 'RadarArrow');

        playerShipArrow.setRotation(10);

        let canvas = this.sys.canvas;
        canvas.style.cursor = 'none';

    }

    update (dt) {

        playerShipArrow.angle = network.getShipHeading() - 90;

    }

}

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [RadarScene]
};

var game = new Phaser.Game(config);