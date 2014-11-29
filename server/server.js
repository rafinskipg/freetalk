var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');
var bodyParser = require('body-parser');

//app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
//app.use( bodyParser.urlencoded() );

// Add headers
/*app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://0.0.0.0:9000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});*/

var sessions = [], users = [];

//Socket connection
io.on('connection', function(socket){

  socket.on('user_connected', function(user){
    user.id = socket.id;
    users.push(user);
    console.log('user_connected', users.length);

    io.emit('refresh_user_list', users);
  });

  //Receive offer
  socket.on('start_call_with', function(options){
    console.log('Request call start with '+options.userDestiny.id + ' from '+ options.userCalling.id);
    createCall(socket, options.userCalling, options.userDestiny, options.offer);
  });

  //Receive answer
  socket.on('answer',function(options){
    emitAnswer(socket, options.userDestiny, options.answer);
  });

  //Receive candidates
  socket.on('ice_candidate', function(options){
    console.log('Received ice candidate')
    sendCandidate(socket, options.userDestiny, options.candidate);
  });


  //User disconnected
  socket.on('disconnect', function(){
    users =  _.compact(users.map(function(user){
      if(user.id != socket.id){
        return user;
      }
    }));
  
    io.emit('refresh_user_list', users);
  });
});

function createCall(socket, userCalling, userDestiny, offer){
  var sessionId = Date.now();
  var session = new Session(userCalling.id, userDestiny.id);
  session.offer = offer;
  sessions.push(session);

  socket.broadcast.to(userDestiny.id).emit('receiveOffer', {
    offer:offer,
    caller: userCalling
  });
  
  return sessionId;
}

function emitAnswer(socket, userDestiny,answer){
  socket.broadcast.to(userDestiny.id).emit('answer', answer);
}

function sendCandidate(socket, userDestiny, candidate){
  socket.broadcast.to(userDestiny.id).emit('receiveIceCandidate', candidate);
}

function Session(idCaller, idCallee){
  this.idCaller = idCaller; 
  this.idCallee = idCallee;
  this.id = Date.now();
  this.status = null;
}


function getSession(sessionId){

  var possibleSessions = _.filter(sessions, function(session){
    return session.id == sessionId;
  });

  var result =  possibleSessions.length > 0 ? possibleSessions[0] : null;
  console.log('Searching for session, found ', result);
  return result;
}



http.listen(3000);

module.exports = http;