'use strict';

var socket, sessionId, userInfo;
var randomNameGenerator = require('./randomNameGenerator');
var utils = require('./utils');

function init(){
  playerInfo = { name : randomNameGenerator(), id: utils.randomId() };

  socket = io('http://127.0.0.1:3000');

  //Request play vs AI
  $('.vsAI').on('click', function(){
    $('.waiting').removeClass('hidden');
    socket.emit('request_play_AI', playerInfo);
  });

  //Start game
  socket.on('start_game', function(game){
    gameIdentificator = game.id;
    $('.waiting').addClass('hidden');
    $('.websocketsInfo').addClass('hidden');
    core.start(game.players);
  });

  //Render user list
  socket.on('refresh_user_list', function(users){
    var content = $('<div ></div>');
    users.forEach(function(user){
      content.append('<div class="list-group-item">'+ user.name + '</div>');
    })
    $('.users').html(content);
  });

  //Emit connected
  socket.emit('user_connected', playerInfo);
  

  //Push enemy
  socket.on('new_enemy', function(enemy){
    console.log('new enemy connected');
    enemiesController.addEnemy(enemy);
  });


}


module.exports = {
  init: init
}