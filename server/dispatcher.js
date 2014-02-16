'use strict';
var _ = require('underscore');

function UsersController(socket) {
	var proto = UsersController.prototype,
		self = this;
	_.functions(proto).forEach(function (mth) {
		socket.on(mth, proto[mth].bind(self));
	});
}
UsersController.prototype = {
	disconnect: function () {
		this.user.disconnect();
	},
	say: function (data) {
		this.room.addChat(this.user.name, data);
		this.room.broadcast('say', this.user.name, data);

	},
	join: function (data) {
		this.user.join(data);
	}
};

exports.UsersController = UsersController;
