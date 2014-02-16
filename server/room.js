'use strict';
var util = require('util'),
	EventEmitter = require('events').EventEmitter,
	_ = require('underscore');
var User = require('./user').User;

function Room(name) {
	EventEmitter.call(this);
	this.name = name;
	this.users = {};
	this.chats = [];
	Room.rooms[name] = this;
}
util.inherits(Room, EventEmitter);

Room.find = function (name) {
	return this.rooms[name];
};

Room.rooms = {};
Room.setupServer = function (server, Controller) {
	this.server = server;
	Room.prototype.server = server;
	var room = new Room('test');
	server.sockets.on('connection', function (socket) {
		var user = new User(socket.handshake.user, socket);
		var controller = new Controller(socket);
		user.bindSocket(socket);
		user.join(room);
		controller.user = user;
		controller.room = room;
		socket.controller = controller;
	});
};

Room.broadcastTo = function (roomName, event, data) {
	this.server.sockets.in(roomName).emit(event, data);
};

_.extend(Room.prototype, {
	addUser: function (user) {
		this.broadcast('join', user.name);
		this.users[user.name] = user;
		this.emit('join', user);
	},
	removeUser: function (user) {
		delete this.users[user.name];
		this.broadcast('leave', user.name);
		this.emit('leave', user);
	},
	addChat: function (user, content) {
		this.chats.push([user, content]);
	},
	broadcast: function () {
		//debugger;
		var ns = Room.server.sockets.in(this.name);
		ns.emit.apply(ns, arguments);
	}
});

exports.Room = Room;
