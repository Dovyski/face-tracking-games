/**
 * This is the initial point for the game.
 */

var Game = new Phaser.Game(Constants.GAME_WIDTH, Constants.GAME_HEIGHT, Phaser.AUTO, 'card-flipper');

// Add all states
Game.state.add('play', PlayState);

// Start the initial state
Game.state.start('play');
