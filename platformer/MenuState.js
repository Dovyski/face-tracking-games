/**
 * Describes the game menu.
 */

var MenuState = function() {
	this.mPlayBtn = null;
	this.mPlayLabel = null;
	this.mCreditsBtn = null;
	this.mCreditsLabel = null;
	this.mDialog = null;

	this.create = function() {
		this.mDialog		= Game.add.sprite(Game.world.centerX - 130, Game.world.centerY - 80, 'dialog-small');

		this.mPlayBtn 		= Game.add.button(Game.world.centerX - 90, Game.world.centerY - 25, 'blue-button', this.onPlay, this, 0, 1, 2);
		this.mCreditsBtn 	= Game.add.button(Game.world.centerX - 90, this.mPlayBtn.position.y + this.mPlayBtn.height + 20, 'blue-button', this.onCredits, this, 0, 1, 2);

		this.mPlayLabel 	= Game.add.text(this.mPlayBtn.position.x + 60, this.mPlayBtn.position.y + 7, 'Play!', {fill: '#000', fontSize: 24});
		this.mCreditsLabel 	= Game.add.text(this.mCreditsBtn.position.x + 50, this.mCreditsBtn.position.y + 7, 'Credits', {fill: '#000', fontSize: 24});

		// Generate a unique string to anonymously collect data.
		GlobalInfo.uuid = Game.rnd.uuid();
		GlobalInfo.game = 3; // The id of this game.
	};

	this.onPlay = function() {
		Game.state.start('play');
	};

	this.onCredits = function() {
		console.log('Credits!');
	};
};