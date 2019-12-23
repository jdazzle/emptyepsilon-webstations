const axios = require('axios');
const controls = require('./hardware.js');
let server_address = 'http://localhost:8080/';
let get_operation = 'get.lua';
let set_operation = 'set.lua';
let exec_operation = 'exec.lua';
let target_object = 'getPlayerShip(-1)';
let radar_contacts = [];

let ship_heading;
let ship_x;
let ship_y;
let ship_impulse_max_speed;

setInterval(_getNetworkInfo, 10);
//setInterval(setImpulse, 100);

function _getNetworkInfo(){

    let params = `
        return_stuff = {}
        player = getPlayerShip(-1);
        local x, y = player:getPosition();
        objects_in_radius = getObjectsInRadius(x, y, 5000);
        return_objects_in_radius = {};

        i = 0
        for key, space_object in ipairs(objects_in_radius) do
            if space_object:getCallSign() ~= player:getCallSign() then
                space_object_parameters = {}
                local x, y = space_object:getPosition();
                space_object_parameters['callsign'] = space_object:getCallSign();
                space_object_parameters['x'] = x;
                space_object_parameters['y'] = y;
                space_object_parameters['rotation'] = space_object:getRotation();
                --space_object_parameters['typeName'] = space_object:getTypeName();
                return_objects_in_radius['object_'..i] = space_object_parameters;
                i = i + 1;
            end
        end

        return_stuff['rotation'] = player:getHeading();
        return_stuff['impulseMaxSpeed'] = player:getImpulseMaxSpeed();
        return_stuff['x'] = x;
        return_stuff['y'] = y;
        return_stuff['objects_in_range'] = return_objects_in_radius;

        return return_stuff;
    `;
    let target_address = server_address.concat(exec_operation, '?', params);
    axios.post(target_address, params)
        .then(function (response) {
            console.log(response.data);
            ship_heading = response.data.rotation;
            ship_impulse_max_speed = response.data.impulseMaxSpeed;

            if(ship_heading >  360){
                setRotation(ship_heading - 360);
            } else if(ship_heading < 0){
                setRotation(ship_heading + 360);
            }

            ship_x = response.data.x;
            ship_y = response.data.y;
            objects_in_range = response.data.objects_in_range;
            var length = Object.keys(objects_in_range).length;
            for(var i = 0; i < length; i++){
                var space_object = objects_in_range['object_' + i];
                let existing_contact = radar_contacts.find(function(element){
                    return element.callsign == space_object.callsign;
                });
                if(existing_contact){

                } else {
                    radar_contacts.push(space_object);
                }
            }
            //console.log(radar_contacts);
        })
        .catch(function (error) {
            // handle error
            //console.log(error);
        })
        .finally(function () {
            // always executed
        });

}

function setShipImpulse(impulse){

	var params = '';
	//var impulse = controls.getImpulseControl() / 100;
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

function setShipHeading(heading){

    if(heading < 0){
        heading = heading + 360;
    } else if(heading > 360){
        heading = heading - 360;
    }

    var params = '';
    params = 'commandTargetRotation(' + heading + ')';

    let target_address = server_address.concat(set_operation, '?', '_OBJECT_=', target_object, '&', params);

    axios.get(target_address)
        .then(axios.spread((response1) => {
            //console.log(response1.data.alertLevel);
            //alertLevel = response1.data.alertLevel;
        })).catch(error => {
            //console.log(error);
        });

}

function setRotation(rotation){

    var params = '';
    params = 'setRotation(' + rotation + ')';

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

exports.getShipX = function(){
    return ship_x;
}

exports.getShipY = function(){
    return ship_y;
}

exports.setShipHeading = function(heading){
    setShipHeading(heading);
}

exports.getShipImpulseMaxSpeed = function(){
    return ship_impulse_max_speed;
}

exports.setShipImpulse = function(impulse){
    setShipImpulse(impulse);
}