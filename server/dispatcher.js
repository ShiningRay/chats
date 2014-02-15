'use strict';
var _ = require('underscore');

function UsersController(user) {
	var proto = UsersController.prototype;
	_.functions(proto).forEach(function (mth) {
		user.socket.on(mth, proto[mth].bind(user));
	});
}
UsersController.prototype = {
	disconnect: function () {
		this.disconnect();
	},
	sendchat: function (data) {
		this.room.broadcast('updatechat', this.name, data);
	},
	join: function (data) {
		this.join(data);
	}
};

exports.UsersController = UsersController;
