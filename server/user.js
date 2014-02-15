'use strict';

function User(name, socket) {
	this.socket = socket;
	socket.user = this;
	this.name = name;
	User.table[name] = this;
}

User.find = function (name) {
	return this.table[name];
};

User.remove = function (name) {
	delete this.table[name];
};

User.table = {};

User.prototype = {
	join: function (room) {
		if (typeof room === 'string') {
			room = Room.find(room);
		}

		this.room = room;
		room.addUser(this);
		this.socket.join(room.name);
	},
	leave: function () {
		if (this.room) {
			this.room.removeUser(this);
			this.socket.leave(this.room.name);
		}
	},
	broadcast: function () {
		var ns = this.socket.broadcast.to(this.room.name);
		ns.emit.apply(ns, arguments);
	},
	send: function (msg) {
		this.socket.emit(msg);
	},
	disconnect: function () {
		this.leave();
		this.socket = null;
		delete User.table[this.name];
	}
};

exports.User = User;
