/**
 * A class with all constants in the game
 */

var Constants = new function() {
	this.GAME_SEED 				= 1234;
	this.GAME_WIDTH 			= 1024;
	this.GAME_HEIGHT 			= 768;
	this.GAME_MATCH_DURATION	= 7 * 60 * 1000; // Duration, in milliseconds, of a single match.
	this.GAME_ENABLE_DATA_LOG	= true; 	// Defines if the game should collect and send anonymous data regarding usage
	this.GAME_HEALTH_MAX		= 100; 		// Max health points available in the game.

	this.CARDS_MAX 				= 25;		// Total number of cards in the game
	this.CARDS_PER_ROW 			= 5;		// Amount of cards in each row
	this.CARDS_COLORS			= 7;
	this.CARDS_DIST_TARGET		= 100;

	this.QUESTION_DURATION_1ST	= 2 * 60 * 1000;	// Time, in milliseconds, a question should remain active during the very fist question
	this.QUESTION_DOWN_PACE_1ST = 800;				// Same as QUESTION_DOWN_PACE, but for the very first question.

	this.HUD_RIGHT_WRONG_TTL	= 1000;				// Time, in milliseconds, the "right/wrong" sign remains on the screen.
	this.MUSIC_VOLUME			= 1.0;
	this.SFX_VOLUME				= 1.0;

	this.DIFFICULTY = [
		{ // 1
			CARDS_FLIPS_TURN: 2,					// Amount of cards that will will be flipped every time a new question is generated.
			QUESTION_DURATION: 70000,				// Time, in milliseconds, a question should remain active
			QUESTION_DOWN_PACE: 100,				// Time, in milliseconds, to decrease time bar if there are no more cards to flip.
			GAME_MISTAKE_HEALTH: 5,					// How many health point you loose when you make a mistake.
			GAME_CORRECT_HEALTH: 5 					// How many health point you win when you make a mistake.
		},
		{ // 2
			CARDS_FLIPS_TURN: 3,
			QUESTION_DURATION: 50000,
			QUESTION_DOWN_PACE: 1100,
			GAME_MISTAKE_HEALTH: 5,
			GAME_CORRECT_HEALTH: 5
		},
		{ // 3
			CARDS_FLIPS_TURN: 4,
			QUESTION_DURATION: 40000,
			QUESTION_DOWN_PACE: 1100,
			GAME_MISTAKE_HEALTH: 5,
			GAME_CORRECT_HEALTH: 2
		},
		{ // 4
			CARDS_FLIPS_TURN: 6,
			QUESTION_DURATION: 20000,
			QUESTION_DOWN_PACE: 1100,
			GAME_MISTAKE_HEALTH: 10,
			GAME_CORRECT_HEALTH: 1
		},
		{ // 5
			CARDS_FLIPS_TURN: 8,
			QUESTION_DURATION: 11000,
			QUESTION_DOWN_PACE: 1100,
			GAME_MISTAKE_HEALTH: 15,
			GAME_CORRECT_HEALTH: 1
		},
		{ // 6
			CARDS_FLIPS_TURN: 12,
			QUESTION_DURATION: 8000,
			QUESTION_DOWN_PACE: 1100,
			GAME_MISTAKE_HEALTH: 20,
			GAME_CORRECT_HEALTH: 1
		},
		{ // 7
			CARDS_FLIPS_TURN: 16,
			QUESTION_DURATION: 6000,
			QUESTION_DOWN_PACE: 1100,
			GAME_MISTAKE_HEALTH: 25,
			GAME_CORRECT_HEALTH: 1
		}
	];
};
