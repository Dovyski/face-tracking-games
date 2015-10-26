/**
 * Loads all assets used by the game
 */

var LoadState = function() {
	this.create = function() {
		Game.state.start('setup');
	};

	this.preload = function() {
		Game.load.spritesheet('card', 'assets/card.png', 145, 207); // By jeffshee, CC-BY 3.0, http://opengameart.org/content/colorful-poker-card-back
	};
};
