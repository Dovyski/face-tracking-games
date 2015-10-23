/**
 * This is the initial point for the game.
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'card-flipper', { preload: preload, create: create });


var mCards; // group with all the cards

function create() {
	var i, aCard;

	mCards = game.add.group();

	for(var i = 0; i < Constants.MAX_CARDS; i++) {
		aCard = new Card(game, 50 * i, game.world.centerY);
		mCards.add(aCard);
	}
}

function preload () {
	game.load.image('card-blue', 'assets/card_blue.png'); // By jeffshee, CC-BY 3.0, http://opengameart.org/content/colorful-poker-card-back
}
