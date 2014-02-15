'use strict';
var User = require('./user').User;

function Room(name) {
	this.name = name;
	this.users = [];
	Room.rooms[name] = this;
}

Room.find = function (name) {
	return this.rooms[name];
};

Room.rooms = {};
Room.setupServer = function (server, Controller) {
	this.server = server;
	Room.prototype.server = server;
	server.sockets.on('connection', function (socket) {
		var user = new User(socket.handshake.user, socket);
		socket.controller = new Controller(user);
		var room = new Room('test');
		user.join(room);
	});
};

Room.broadcastTo = function (roomName, event, data) {
	this.server.sockets.in(roomName).emit(event, data);
};

Room.prototype = {
	addUser: function (user) {
		this.broadcast({type: 'system', source: user.name, action: 'join'});
		this.users.push(user);
	},
	removeUser: function (user) {
		//this.users.remove(user);
		this.broadcast({type: 'system', source: user.name, action: 'leave'});
	},
	broadcast: function () {
		var ns = Room.server.sockets.in(this.name);
		ns.emit.apply(ns, arguments);
	}
};

exports.Room = Room;
