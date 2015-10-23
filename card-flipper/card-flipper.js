/**
 * This is the initial point for the game.
 */

var game = new Phaser.Game(Constants.GAME_WIDTH, Constants.GAME_HEIGHT, Phaser.AUTO, 'card-flipper', { preload: preload, create: create });


var mCards; // group with all the cards

function create() {
	var i,
		j = 0,
		aCard;

	mCards = game.add.group();

	for(i = 0; i < Constants.MAX_CARDS; i++) {
		if(i != 0 && (i % Constants.CARDS_PER_ROW) == 0) {
			j++;
		}

		aCard = new Card(game, game.world.width * 0.15 + 160 * (i % Constants.CARDS_PER_ROW), game.world.height * 0.15 + 230 * j);
		mCards.add(aCard);
	}
}

function preload () {
	game.load.image('card-blue', 'assets/card_blue.png'); // By jeffshee, CC-BY 3.0, http://opengameart.org/content/colorful-poker-card-back
}
