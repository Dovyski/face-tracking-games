/**
 * A class with all constants in the game
 */

var Constants = new function() {
	this.GAME_SEED 				= 1234;
	this.GAME_WIDTH 			= 1024;
	this.GAME_HEIGHT 			= 768;
	this.GAME_MATCH_DURATION	= 0.5 * 60 * 1000; // Duration, in milliseconds, of a single match.
	this.GAME_ENABLE_DATA_LOG	= true; 	// Defines if the game should collect and send anonymous data regarding usage
	this.GAME_HEALTH_MAX		= 100; 		// Max health points available in the game.
	this.GAME_MISTAKE_HEALTH	= 5; 		// How many health point you loose when you make a mistake.
	this.GAME_CORRECT_HEALTH	= 1; 		// How many health point you win when you make a mistake.

	this.PLAYER_POSITION_X		= 0.15; 	// Relative to screen width, percentage of player's position (from the left).

	this.DIFFICULTY	= [						// Controls the difficulty of the game. Each entry means a piece of time
		{
			speed: -100,					// Speed of the platforms
			obstacles_chance: 0.3,			// Chances of adding obstacles on a platform
			obstacles_per_platform: 1,		// Number of obstacles for each platform
			obstacle_min_pos: 50,			// Min. amount of pixels from the begining of the platform until the obstacle.
			obstacle_min_spacing: 100,		// Min. amount of pixels between the obstacles.
			platforms_before_slope: 3		// Number of flat platforms before adding a slope
		}
	];
};
