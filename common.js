PUBNUB_PUBLISH_KEY = 'pub-2a74afb2-4170-4513-a3a6-d86488d2a840';
PUBNUB_SUBSCRIBE_KEY = 'sub-0a475e45-f370-11e0-b644-e988ec791e8c';

var pubnub = null;
var sessionContext = null;

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createChannelID() {
	s = '12345abcde'.split('');
	for (var i = 0; i < s.length - 1; i++) {
		j = getRandomInt(i+1, s.length);
		tmp = s[i];
		s[i] = s[j];
		s[j] = tmp;
	}
	return s.join('');
}

function createMessageRow(m) {
	text = m.text;
	src = m.src;
	rowHTML = 
		'<li class="list-group-item d-flex justify-content-between align-items-center list-group-item-action">' + 
		'<div id="msg">' + text + '</div>' + 
		'<span class="badge badge-secondary">' + src + '</span></li>';
	li = $(rowHTML);
	return li;
}

function onMessage(m) {
	// handle message
	var li = createMessageRow(m.message);
	li.appendTo($("#msglist"));
}

function push(e) {
	text = $("#push-textarea").val();
	pubnub.publish(
    {
      message: {
				text: text,
				src: sessionContext.role				
			},
      channel: sessionContext.channel,
      sendByPost: false, // true to send via post
      storeInHistory: false, //override default storage options
      meta: {
      } // publish extra meta with the request
    },
    function (status, response) {
        // handle status, response
    }
	);	
}