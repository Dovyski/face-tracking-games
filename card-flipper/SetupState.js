/**
 * Setups everything required for the face tracking thing to work.
 */

var SetupState = function() {
	this.create = function() {
		Game.state.start('play');
		console.log('Setup!');
	};

	this.update = function() {
	};
};
