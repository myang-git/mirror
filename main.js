$(document).ready(init);		

function init() {
	sessionContext = {
		channel: createChannelID(),
		uid: 15,
		role: 'desktop'
	};
	
	pubnub = new PubNub({
		publish_key: PUBNUB_PUBLISH_KEY,
		subscribe_key: PUBNUB_SUBSCRIBE_KEY,
		ssl: true
	});

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

	sessionContextJson = JSON.stringify(sessionContext);

	var qrcode = 
		new QRCode(
			$("#qrcode")[0], 
			{
				text: sessionContextJson,
				width: 180,
				height: 180
			}
		);

	$("#push-button").click(push);
}

