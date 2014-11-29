isCaller = true;
 
error = function (error) {
    console.log(error);
}
 
init = function (onSuccess) {
    pc = new webkitRTCPeerConnection({
        "iceServers": [{
            "url": "stun:stun.l.google.com:19302"
        }]
    });
    iceCandidates = [];
 
    var v = document.getElementById('v');
 
    pc.onaddstream = function (event) {
        console.log("onaddstream");
        console.log(event);
        v.src = URL.createObjectURL(event.stream);
        v.play();
    };
 
    pc.onicecandidate = function (event) {
        if (event.candidate) {
            console.log("candidate saved..." + event.candidate.candidate);
            iceCandidates.push(event.candidate.candidate);
        } else if (pc.iceGatheringState == "complete") {
            console.log("Paste in callee these calls:");
 
            out = "";
            for (var i = 0; i < iceCandidates.length; i++) {
                out += "addIceCandidate(atob('" + btoa(iceCandidates[i]) + "' ));" + "\n";
            }
            console.log(out);
 
        }
    };
 
    navigator.webkitGetUserMedia({
        video: true,
        audio: true
    },
    onSuccess,
    error);
}
 
if (isCaller) {
    init(
 
    function (localMediaStream) {
        pc.addStream(localMediaStream);
        pc.createOffer(function (offer) {
            pc.setLocalDescription(
 
            new RTCSessionDescription(offer),
 
            function () {
                console.log(offer.sdp);
                console.log("Paste on callee:");
                console.log("receiveOffer(atob('" + btoa(offer.sdp) + "'))");
            });
        });
    });
}
 
receiveOffer = function (offerSdp) {
    init(
 
    function (localMediaStream) {
        pc.addStream(localMediaStream);
        pc.setRemoteDescription(new RTCSessionDescription({
            type: "offer",
            sdp: offerSdp
        }),
 
        function () {
            pc.createAnswer(function (answer) {
                pc.setLocalDescription(answer);
                console.log(answer.sdp);
                console.log("Paste on caller:");
                console.log("receiveAnswer(atob('" + btoa(answer.sdp) + "'))");
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
 
receiveAnswer = function (answerSdp) {
    pc.setRemoteDescription(new RTCSessionDescription({
        type: "answer",
        sdp: answerSdp
    }));
}
 
addIceCandidate = function (candidateSdp) {
    pc.addIceCandidate(new RTCIceCandidate({
        candidate: candidateSdp
    }));
}