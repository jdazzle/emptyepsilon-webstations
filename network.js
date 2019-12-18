const axios = require('axios');
const controls = require('./hardware.js');
let server_address = 'http://localhost:8080/';
let get_operation = 'get.lua';
let set_operation = 'set.lua';
let target_object = 'getPlayerShip(-1)';

setInterval(getInformation, 1000, 'alertLevel=getAlertLevel()');
setInterval(setImpulse, 100);

function getInformation(params){

	let target_address = server_address.concat(get_operation, '?', '_OBJECT_=', target_object, '&', params);

	axios.all([
			axios.get(target_address)
  		]).then(axios.spread((response1) => {
    		console.log(response1.data.alertLevel);
    		alertLevel = response1.data.alertLevel;
  		})).catch(error => {
    		console.log(error);
  		});

}

function setImpulse(){

	var params = '';
	var impulse = controls.getImpulseControl() / 100;
	console.log(impulse);
	params = 'commandImpulse(' + impulse + ')';

	let target_address = server_address.concat(set_operation, '?', '_OBJECT_=', target_object, '&', params);

	axios.all([
			axios.get(target_address)
  		]).then(axios.spread((response1) => {
    		console.log(response1.data.alertLevel);
    		alertLevel = response1.data.alertLevel;
  		})).catch(error => {
    		console.log(error);
  		});

}