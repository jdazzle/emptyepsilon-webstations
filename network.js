const axios = require('axios');
const controls = require('./hardware.js');
let server_address = 'http://localhost:8080/';
let get_operation = 'get.lua';
let set_operation = 'set.lua';
let target_object = 'getPlayerShip(-1)';

let ship_heading = 0;

setInterval(_getShipHeading, 100);
setInterval(setImpulse, 100);

function _getShipHeading(){

    let params = 'heading=getHeading()'

    let target_address = server_address.concat(get_operation, '?', '_OBJECT_=', target_object, '&', params);

    axios.get(target_address)
        .then(function (response) {
            // handle success
            //console.log(response);
            ship_heading = response.data.heading;
            //console.log(heading);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .finally(function () {
            // always executed
        });

}

function setImpulse(){

	var params = '';
	var impulse = controls.getImpulseControl() / 100;
	params = 'commandImpulse(' + impulse + ')';

	let target_address = server_address.concat(set_operation, '?', '_OBJECT_=', target_object, '&', params);

	axios.get(target_address)
        .then(axios.spread((response1) => {
    		//console.log(response1.data.alertLevel);
    		//alertLevel = response1.data.alertLevel;
  		})).catch(error => {
    		//console.log(error);
  		});

}

exports.getShipHeading = function(){
    return ship_heading;
}
