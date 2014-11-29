'use strict';
var events = require('./events');
var peerConnection;
var iceCandidates;
var pendingAcceptCandidates;
var canAcceptIce = false;
var error = function(err){
  console.log('Error doing things', err);
}

function init(onSuccess){

  peerConnection = new webkitRTCPeerConnection({
    "iceServers": [{
        "url": "stun:stun.l.google.com:19302"
    }]
  });

  iceCandidates = [];
  pendingAcceptCandidates = [];
  var video = document.getElementById('video');
 
  peerConnection.onaddstream = function (event) {
    console.log("onaddstream");
    console.log(event);
    video.src = URL.createObjectURL(event.stream);
    video.play();
  };
 
  peerConnection.onicecandidate = function (event) {
    if (event.candidate) {
      //console.log("candidate saved..." + event.candidate.candidate);
      iceCandidates.push(event.candidate.candidate);
    } else if (peerConnection.iceGatheringState == "complete") {
      console.log("Sending ice candidates to callee");

      for (var i = 0; i < iceCandidates.length; i++) {
        events.trigger('iceCandidate', btoa(iceCandidates[i]));
      }
    }
  };
 
  navigator.webkitGetUserMedia({
    video: true,
    audio: true
  },
  onSuccess,
  error);
}


//Create a call
function createOffer(cb){
  init(
    function (localMediaStream) {
      canAcceptIce = true;
      peerConnection.addStream(localMediaStream);
      peerConnection.createOffer(function (offer) {
      peerConnection.setLocalDescription(

      new RTCSessionDescription(offer),

      function () {
        console.log('offer created, sending it');
        cb(btoa(offer.sdp));
      });
    });
  });

}

//Receive a call
function receiveOffer(offerSdp,cb){
  offerSdp = atob(offerSdp);

  init(
 
    function (localMediaStream) {
      peerConnection.addStream(localMediaStream);
      peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: "offer",
        sdp: offerSdp
      }),
 
      function () {
        canAcceptIce = true;
        peerConnection.createAnswer(function (answer) {
            peerConnection.setLocalDescription(answer);
            console.log("Created answer");
            cb(btoa(answer.sdp));
        },
        error, {
            mandatory: {
                OfferToReceiveAudio: true,
                OfferToReceiveVideo: true
            }
        });

      },
      error);
    });
}

function receiveIceCandidate(iceCandidate){
  if(!canAcceptIce){
    pendingAcceptCandidates.push(iceCandidate);
    setInterval(mergeCandidates, 100);
  }else{
    peerConnection.addIceCandidate(new RTCIceCandidate({
      candidate: atob(iceCandidate)
    }));
  }
}

function mergeCandidates(){
  if(canAcceptIce){
    for(var i = 0; i < pendingAcceptCandidates.length; i++){
      peerConnection.addIceCandidate(new RTCIceCandidate({
        candidate: atob(pendingAcceptCandidates[i])
      }));
    }
    pendingAcceptCandidates = [];
  }
}

module.exports = {
  createOffer: createOffer,
  receiveOffer: receiveOffer,
  receiveIceCandidate: receiveIceCandidate

}