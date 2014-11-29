'use strict';

var socket, sessionId, userInfo;
var randomNameGenerator = require('./randomNameGenerator');
var utils = require('./utils');
var events = require('./events');
var _  = require('lodash');
var webrtcPak = require('./webrtcpak');

function init(){
  console.log('inited')

  var playerInfo = { name : randomNameGenerator(), _id: utils.randomId() };
  var theOtherUser;
  var isCaller = false;

  socket = io('http://127.0.0.1:3000');

  //Render user list
  socket.on('refresh_user_list', function(users){
    users = _.compact(users.map(function(user){
      console.log(user._id, playerInfo._id)
      if(user._id != playerInfo._id){
        return user;
      }else{
        playerInfo.id = user.id; //Refresh server generated id
      }
    }));
    events.trigger('users', users);
  });

  //Emit connected
  console.log('User connected', playerInfo)
  socket.emit('user_connected', playerInfo);  

  //Start a call
  events.suscribe('startCall', function(userDestiny){
    console.log('Requested create call', userDestiny, playerInfo);
    theOtherUser = userDestiny;
    webrtcPak.createOffer(function(offer){  
      socket.emit('start_call_with', {
        userDestiny: theOtherUser,
        userCalling: playerInfo,
        offer: offer
      });
    });
  });

  //Receive a call -- only for !isCaller
  socket.on('receiveOffer', function(options){
    theOtherUser = options.caller;
    webrtcPak.receiveOffer(options.offer, function(answer){
      socket.emit('answer', {
        userDestiny: theOtherUser,
        userCalling: playerInfo,
        answer: answer
      });
    });
  });

  //Send ice candidates -- for all
  events.suscribe('iceCandidate', function(iceCandidate){
    socket.emit('ice_candidate', {
        userDestiny: theOtherUser,
        userCalling: playerInfo,
        candidate: iceCandidate
      });
  });

  //Receive ice candidates
  socket.on('receiveIceCandidate', function(iceCandidate){
    webrtcPak.receiveIceCandidate(iceCandidate);
  });

}


module.exports = {
  init: init
}