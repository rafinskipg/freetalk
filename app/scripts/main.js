/*
  Start endpoint
 */

var webRtcConnection = require('./webRtcConnection');

$(document).ready(function(){
	webRtcConnection.init();
});
  