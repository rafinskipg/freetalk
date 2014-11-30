# Freetalk

WebRTC Boilerplate application

This is a web application, that lists the users connected on a websocket and allows "calling" them to start a video conference.
![Example image](https://raw.githubusercontent.com/rafinskipg/freetalk/master/capture.png)


##Install
```
bower install
npm install
```

##Run

The client side
```
grunt serve
```

The server side
```
node server/server.js
```

##Contribute
Contribute in order to improve this solution, so more people will benefit from the knowledge


##Documentation

The logic is on the `webRtcConnection.js` file, this file is the responsible of the following things

* Notifying the socket that a new user has entered
* Refreshing the user list
* Sending a call request (A.K.A offer)
* Receiving a call request
* Sending a call response (A.K.A answer)
* Sending iceCandidates
* Receiving iceCandidates

This actions will talk with `webrtcpak.js` that has the logic for the p2p communication


The users list and pages are rendered with *React.js*

