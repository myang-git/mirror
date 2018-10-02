var video = null;
var cameraViewElement = null;
var cameraViewCanvas = null;

$(document).ready(init);		

function init() {
	$("#push-button").click(push);
	readQRCode();
}


function readQRCode() {
	video = document.createElement("video");
	cameraViewElement = $("#camera-view")[0];
	cameraViewCanvas = cameraViewElement.getContext("2d");;

	navigator.mediaDevices.getUserMedia({
			video: {facingMode: "environment"} 
	}).then(function(stream) {
	  video.srcObject = stream;
	  video.setAttribute("playsinline", true);
	  video.play();
	  requestAnimationFrame(tick);
	});
}

function stopCamera(stream) {
	stream.getAudioTracks().forEach(function(track) {
		track.stop();
	});
	stream.getVideoTracks().forEach(function(track) {
		track.stop();
	});
}

function tick() {
	detectedQRCode = false;
	sessionContext = null;
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    cameraViewElement.height = video.videoHeight;
    cameraViewElement.width = video.videoWidth;
    cameraViewCanvas.drawImage(video, 0, 0, cameraViewElement.width, cameraViewElement.height);
    var imageData = cameraViewCanvas.getImageData(0, 0, cameraViewElement.width, cameraViewElement.height);
    var code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    if (code) {
    	try {
	    	sessionContext = JSON.parse(code.data);
	    	detectedQRCode = true;
    	}
    	catch (e) {
    		detectedQRCode = false;
    	}
    }
  }
  if (!detectedQRCode) {
  	requestAnimationFrame(tick);
  }
  else {
  	stopCamera(video.srcObject);
  	$('#camera-container').hide();
  	initSession(sessionContext);
  }
}   

function initSession(context) {
	sessionContext.channel = context.channel;
	sessionContext.uid = (parseInt(context.uid) + 1) % 16;
	sessionContext.role = 'phone';

	pubnub = new PubNub({
		publish_key: 'pub-2a74afb2-4170-4513-a3a6-d86488d2a840',
		subscribe_key: 'sub-0a475e45-f370-11e0-b644-e988ec791e8c',
		ssl: true
	});

	subscribe();
} 

function subscribe() {
	pubnub.subscribe({
		channels: [sessionContext.channel]
	});	

	pubnub.addListener({
	  message: function(m) {
	  	onMessage(m);
	  },
	  presence: function(p) {
	      // handle presence
	      var action = p.action; // Can be join, leave, state-change or timeout
	      var channelName = p.channel; // The channel for which the message belongs
	      var occupancy = p.occupancy; // No. of users connected with the channel
	      var state = p.state; // User State
	      var channelGroup = p.subscription; //  The channel group or wildcard subscription match (if exists)
	      var publishTime = p.timestamp; // Publish timetoken
	      var timetoken = p.timetoken;  // Current timetoken
	      var uuid = p.uuid; // UUIDs of users who are connected with the channel
	  },
	  status: function(s) {
	      var affectedChannelGroups = s.affectedChannelGroups;
	      var affectedChannels = s.affectedChannels;
	      var category = s.category;
	      var operation = s.operation;
	  }
	});	
	
}
