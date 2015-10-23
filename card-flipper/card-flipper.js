/**
 * This is the initial point for the game.
 */

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'card-flipper', { preload: preload, create: create });

var text;
var counter = 0;

function preload () {
	game.load.image('einstein', 'assets/ra_einstein.png');
}

function create() {
	var image = game.add.sprite(game.world.centerX, game.world.centerY, 'einstein');

	//  Moves the image anchor to the middle, so it centers inside the game properly
	image.anchor.set(0.5);

	//  Enables all kind of input actions on this image (click, etc)
	image.inputEnabled = true;
	image.events.onInputDown.add(listener, this);

	text = game.add.text(250, 16, '', { fill: '#ffffff' });
}

function listener () {
	counter++;
	text.text = "You clicked " + counter + " times!";
}
