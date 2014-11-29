/*
  Start endpoint
 */

window.Router = require('react-router');
window.DefaultRoute = Router.DefaultRoute;
window.Link = Router.Link;
window.RouteHandler = Router.RouteHandler;
window.Route = Router.Route;

var reactApp = require('../templates/router.jsx');

var webRtcConnection = require('./webRtcConnection');

$(document).ready(function(){
	webRtcConnection.init();
  reactApp.start();
});
  