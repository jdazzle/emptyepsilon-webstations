const network = require('../network.js');

let graphics;
let playerShipArrow;
let playerShipHeaderLine;
let radarLabels = [];
let radarTicks1 = [];
let radarTicks2 = [];
let radarTicks3 = [];
let tinyRadarTicks1 = [];
let tinyRadarTicks2 = [];

let positionText;
let headingText;
let commandHeadingText;
let impulseText;

let keyW;
let keyS;
let keyA;
let keyD;

let commandShipHeading;
let commandShipImpulse = 0;

let bHeadingCommandReceived = false;
let bImpulseCommandReceived = false;

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
        playerShipHeaderLine = new Phaser.Geom.Line(960, 540, 960, 40);

        graphics = this.add.graphics();

        for(var i = 0; i < 360; i+= 4){

            if(i % 10 == 0){
                let text = this.add.text();
                let line1 = this.add.line(0, 0, 0, 0, 10, 0, 0x00FF00, 0.5);
                let line2 = this.add.line(0, 0, 0, 0, 20, 0, 0x00FF00, 0.5);
                let line3 = this.add.line(0, 0, 0, 0, 30, 0, 0x00FF00, 0.5);
                line1.setAngle(i);
                line2.setAngle(i);
                line3.setAngle(i);
                text.text = i;
                radarLabels.push(text);
                radarTicks1.push(line1);
                radarTicks2.push(line2);
                radarTicks3.push(line3);
            } else {
                let line4 = this.add.line(0, 0, 0, 0, 5, 0, 0xFFFFFF, 0.5);
                let line5 = this.add.line(0, 0, 0, 0, 5, 0, 0xFFFFFF, 0.5);
                line4.setAngle(i);
                line5.setAngle(i);
                tinyRadarTicks1.push(line4);
                tinyRadarTicks2.push(line5);
            }
            

        }

        let circle1 = new Phaser.Geom.Circle(960, 540, 100);
        let circle2 = new Phaser.Geom.Circle(960, 540, 250);
        let circle3 = new Phaser.Geom.Circle(960, 540, 500);
        Phaser.Actions.PlaceOnCircle(radarLabels, circle3, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(270));
        Phaser.Actions.PlaceOnCircle(tinyRadarTicks1, circle1);
        Phaser.Actions.PlaceOnCircle(radarTicks1, circle1);
        Phaser.Actions.PlaceOnCircle(tinyRadarTicks2, circle2);
        Phaser.Actions.PlaceOnCircle(radarTicks2, circle2);
        Phaser.Actions.PlaceOnCircle(radarTicks3, circle3);

        positionText = this.add.text(10, 10, 'Hello World', { fontFamily: '"Arial"', fontSize: 36 });
        headingText = this.add.text(10, 50, 'Hello World', { fontFamily: '"Arial"', fontSize: 36 });
        commandHeadingText = this.add.text(10, 90, 'Hello World', { fontFamily: '"Arial"', fontSize: 36 });
        impulseText = this.add.text(50, 350, 'Hello World', { fontFamily: '"Arial"', fontSize: 36 });

        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        let canvas = this.sys.canvas;
        canvas.style.cursor = 'none';

    }

    update (dt) {

        if(commandShipHeading == undefined){
            if(network.getShipHeading()){
                commandShipHeading = network.getShipHeading();
            }
        }

        if(keyW.isDown){
            if(commandShipImpulse < network.getShipImpulseMaxSpeed()){
                commandShipImpulse++;
            }
            bImpulseCommandReceived = false;
        }

        if(keyS.isDown){
            if(commandShipImpulse > 0){
                commandShipImpulse--;
            }
            bImpulseCommandReceived = false;
        }

        if (keyA.isDown) {
            commandShipHeading -= 1;
            if(commandShipHeading < 0){
                commandShipHeading = 360 + commandShipHeading;
            } else if(commandShipHeading > 360){
                commandShipHeading = commandShipHeading - 360;
            }
            bHeadingCommandReceived = false;
        }
        if (keyD.isDown) {
            commandShipHeading += 1;
            if(commandShipHeading < 0){
                commandShipHeading = 360 + commandShipHeading;
            } else if(commandShipHeading > 360){
                commandShipHeading = commandShipHeading - 360;
            }
            bHeadingCommandReceived = false;
        }

        if(network.getShipHeading() != commandShipHeading && bHeadingCommandReceived == false){
            network.setShipHeading(commandShipHeading-90);
            bHeadingCommandReceived = true;
        }

        if(bImpulseCommandReceived == false){
            network.setShipImpulse(commandShipImpulse / 100.0);
            bHeadingCommandReceived = true;
        }

        playerShipArrow.angle = network.getShipHeading()-90;
        Phaser.Geom.Line.SetToAngle(playerShipHeaderLine, 960, 540, Phaser.Math.DegToRad(network.getShipHeading()-90), 500);

        graphics.clear();

        graphics.lineStyle(2, 0x00FF00, 0.5);

        graphics.strokeCircle(960, 540, 100);
        graphics.strokeCircle(960, 540, 250);
        graphics.strokeCircle(960, 540, 500);

        graphics.strokeLineShape(playerShipHeaderLine);

        graphics.strokeRect(150, 200, 64, 128);

        positionText.text = "Position - X:" + parseInt(network.getShipX()) + ", Y: " + parseInt(network.getShipY());

        var formatted_heading = network.getShipHeading();
        if(formatted_heading < 0){
            formatted_heading = 360 + formatted_heading;
        } else if(formatted_heading > 360){
            formatted_heading = formatted_heading - 360;
        }

        headingText.text = "Current Heading: " + parseInt(formatted_heading);
        commandHeadingText.text = "Command Heading: " + parseInt(commandShipHeading);
        impulseText.text = "Impulse: " + parseInt(commandShipImpulse) + ' / ' + parseInt(network.getShipImpulseMaxSpeed());

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