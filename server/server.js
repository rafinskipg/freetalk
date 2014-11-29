var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('lodash');
var bodyParser = require('body-parser');

app.use( bodyParser.json({limit: '50mb'}) );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded() );

// Add headers
app.use(function (req, res, next) {
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
});

var sessions = [], users = [];

//Socket connection
io.on('connection', function(socket){
  var connectedUser;

  socket.on('user_connected', function(user){
    user.id = socket.id;
    users.push(user);
    connectedUser = user;
    io.emit('refresh_user_list', users);
  });

  socket.on('start_call', function(user, userIdDestiny, offer){
    connectedUser.caller = true;
    createCall(user, userIdDestiny);
  });

  socket.on('disconnect', function(){
    users =  _.compact(users.map(function(user){
      if(user.id != connectedUser.id){
        return user;
      }
    }));
  
    io.emit('refresh_user_list', users);
  });

  socket.on('answer',function(sessionId, answer){
    emitAnswer(sessionId, answer);
  });

  socket.on('ice_candidate', function(sessionId, candidates){
    var session = getSession(sessionId);
    if(connectedUser.id == session.idCaller){
      sendCandidates(session.idCallee, candidates);
    }else{
      sendCandidates(session.idCaller, candidates);
    }
  })
});

function createCall(userCalling, userIdDestiny, offer){
  var sessionId = Date.now();
  var session = new Session(userCalling.id, userIdDestiny);
  sessions.push(session);

  io.sockets.socket(userCalling.id).emit('callHandShake', {
    id: sessionId,
    role: 'caller'
  });

  io.sockets.socket(userIdDestiny).emit('callHandShake', {
    id: sessionId,
    role: 'callee',
    offer: offer
  });
}

function emitAnswer(sessionId, answer){
  var session = getSession(sessionId);
  io.sockets.socket(session.idCaller).emit('answer', answer);
}

function setCandidates(to, candidates){
  io.sockets.socket(to).emit('candidates', candidates);
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

  return possibleSessions.length > 0 ? possibleSessions[0] : null;
}


http.listen(3000);

module.exports = http;