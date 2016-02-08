/**
 * A class with all constants in the game
 */

var Constants = new function() {
	this.GAME_DEBUG				= false;
	this.GAME_SEED 				= 1234;
	this.GAME_WIDTH 			= 1024;
	this.GAME_HEIGHT 			= 768;
	this.GAME_MATCH_DURATION	= 5 * 60 * 1000; // Duration, in milliseconds, of a single match.
	this.GAME_ENABLE_DATA_LOG	= true; 	// Defines if the game should collect and send anonymous data regarding usage
	this.GAME_HEALTH_MAX		= 100; 		// Max health points available in the game.
	this.GAME_MISTAKE_HEALTH	= 2; 		// How many health point you loose when you make a mistake.
	this.GAME_CORRECT_HEALTH	= 4; 		// How many health point you win when you make a mistake.

	this.PLAYER_POSITION_X		= 0.15; 	// Relative to screen width, percentage of player's position (from the left).

	this.DIFFICULTY	= [						// Controls the difficulty of the game. Each entry means a piece of time
		{
			speed: -150,					// Speed of the platforms
			collectable_chance: 0.7,		// Chances of adding collectables
			collectables_per_platforms: 2,	// Number of collectables for each platform
			collectable_spacing: 300,		// Amount of pixels between the collectables.
			obstacles_chance: 0.3,			// Chances of adding obstacles on a platform
			obstacles_per_platform: 1,		// Number of obstacles for each platform
			obstacle_min_pos: 250,			// Min. amount of pixels from the begining of the platform until the obstacle.
			obstacle_spacing: 200,			// Amount of pixels between the obstacles.
			platforms_before_slope: 5,		// Number of flat platforms before adding a slope
			slope_max_hight: 0.5,			// Relative to screen height, this is the maxium height the player can reach before a slope-down must be added.
			slope_min_hight: 0.6			// Relative to screen height, this is the minimum height the player can reach before a slope-up must be added.
		},
		{
			speed: -175,
			collectable_chance: 0.8,
			collectables_per_platforms: 2,
			collectable_spacing: 300,
			obstacles_chance: 0.6,
			obstacles_per_platform: 1,
			obstacle_min_pos: 200,
			obstacle_spacing: 200,
			platforms_before_slope: 4,
			slope_max_hight: 0.4,
			slope_min_hight: 0.65
		},
		{
			speed: -200,
			collectable_chance: 0.9,
			collectables_per_platforms: 2,
			collectable_spacing: 300,
			obstacles_chance: 0.85,
			obstacles_per_platform: 1,
			obstacle_min_pos: 180,
			obstacle_spacing: 200,
			platforms_before_slope: 3,
			slope_max_hight: 0.4,
			slope_min_hight: 0.7
		},
		{
			speed: -225,
			collectable_chance: 1,
			collectables_per_platforms: 2,
			collectable_spacing: 300,
			obstacles_chance: 0.9,
			obstacles_per_platform: 2,
			obstacle_min_pos: 170,
			obstacle_spacing: 300,
			platforms_before_slope: 2,
			slope_max_hight: 0.4,
			slope_min_hight: 0.75
		},
		{
			speed: -250,
			collectable_chance: 1,
			collectables_per_platforms: 2,
			collectable_spacing: 300,
			obstacles_chance: 1,
			obstacles_per_platform: 2,
			obstacle_min_pos: 130,
			obstacle_spacing: 300,
			platforms_before_slope: 1,
			slope_max_hight: 0.35,
			slope_min_hight: 0.8
		}
	];
};
