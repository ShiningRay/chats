'use strict';
var util = require('util'),
	_ = require('underscore'),
	EventEmitter = require('events').EventEmitter;

function User(name, socket) {
	EventEmitter.call(this);
	this.socket = socket;
	socket.user = this;
	this.name = name;
	User.users[name] = this;
}

util.inherits(User, EventEmitter);

User.find = function (name) {
	return this.users[name];
};

User.remove = function (name) {
	delete this.users[name];
};

User.users = {};

_.extend(User.prototype, {
	bindSocket: function (socket) {
		this.socket = socket;
		this.on('join', function (room) {
			this.socket.join(room.name);
		}).on('leave', function () {
			this.socket.leave(this.room.name);
		});
	},
	assertSocket: function () {
		if (!this.socket) {
			throw 'no socket bound';
		}
	},
	assertRoom: function () {
		if (!this.room) {
			throw 'user has not joined a room';
		}
	},
	join: function (room) {
		this.room = room;
		room.addUser(this);
		this.emit('join', room);
	},
	leave: function () {
		this.assertRoom();
		this.room.removeUser(this);
		this.emit('leave', this.room);
	},
	broadcast: function () {
		this.assertSocket();
		this.assertRoom();
		var ns = this.socket.broadcast.to(this.room.name);
		ns.emit.apply(ns, arguments);
	},
	send: function (msg) {
		this.assertSocket();
		this.socket.emit(msg);
	},
	disconnect: function () {
		this.leave();
		this.socket = null;
	}
});

exports.User = User;
