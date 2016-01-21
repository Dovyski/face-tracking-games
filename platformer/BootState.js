/**
 * Loads the bare minimum required to create a decent loading screen
 */

var BootState = function() {
	this.create = function() {
		Game.state.start('load');
	};

	this.preload = function() {
		// Set the mood
		Game.stage.backgroundColor = 0xFFCC99;

		Game.load.image('loading-background', 'assets/loading_background.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('loading-fill', 'assets/loading_fill.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
	};
};
