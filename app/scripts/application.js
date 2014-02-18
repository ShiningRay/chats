'use strict';
var socket = io.connect(window.location.hostname);

var Chatroom = Ractive.extend({
	template: '#chatroom-tmpl',
	data: {
		chats: [],
		users: [],
		rooms: []
	},
	init: function () {
		this.on('send', function (e) {
			var c = this.get('newchat');
			if (!/^\s*$/.test(c)) {
				socket.emit('say', c);
				this.set('newchat', '');
			}
			e.original.preventDefault();
		});
	},
	addChat: function (username, content) {
		this.get('chats').push({user: username, content: content});
	}
});


// on connection to server, ask for user's name with an anonmyous callback
socket.on('connect', function () {
	//call the s(erver-side function 'adduser' and send one parameter (value of prompt)
	//socket.emit('adduser', prompt("What's your name?"));
	var room = new Chatroom({el: 'chatroom'});
	socket.on('say', function (username, data) {
		room.addChat(username, data);
	});
	socket.on('rename', function (from, to) {
		var users = room.get('users');
		
		//users.
	});
});

