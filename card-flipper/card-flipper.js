/**
 * This is the initial point for the game.
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'card-flipper', { preload: preload, create: create });


function create() {
	var image = new Card(game, game.world.centerX, game.world.centerY);

	game.add.existing(image);
}

function preload () {
	game.load.image('card-blue', 'assets/card_blue.png'); // By jeffshee, CC-BY 3.0, http://opengameart.org/content/colorful-poker-card-back
}
