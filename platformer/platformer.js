/**
 * This is the initial point for the game.
 */

var Game = new Phaser.Game(Constants.GAME_WIDTH, Constants.GAME_HEIGHT, Phaser.AUTO);

// Choose a seed for the random generator.
Game.rnd.sow([Constants.GAME_SEED]);

// Add all states
Game.state.add('play', PlayState);
Game.state.add('setup', SetupState);
Game.state.add('load', LoadState);
Game.state.add('over', GameOverState);
Game.state.add('menu', MenuState);
Game.state.add('boot', BootState);
Game.state.add('tutorial', TutorialState);

// Start the initial state
Game.state.start('boot');
