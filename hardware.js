const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

let path = 'COM4';

const port = new SerialPort(path, { baudRate: 9600 });

let impulse = 0;

const parser = new Readline();
port.pipe(parser);

parser.on('data', function(line){
	impulse = parseInt(line);
});
	
exports.getImpulseControl = function(){
	console.log(impulse);
	return impulse;
}