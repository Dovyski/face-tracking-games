/**
 * A class with all constants in the game
 */

var Constants = new function() {
	this.GAME_WIDTH 			= 1024;
	this.GAME_HEIGHT 			= 768;

	this.CARDS_MAX 				= 12;		// Total number of cards in the game
	this.CARDS_PER_ROW 			= 4;		// Amount of cards in each row
	this.CARDS_MAX_NUMBER		= 15;		// Amount of cards in each row
	this.CARDS_MAX_COLORS		= 3;		// Amount of cards in each row
	this.CARDS_MIN_FLIP_SHOW	= 1000;		// Min time, in milliseconds, a card show be shown to the player
	this.CARDS_MAX_FLIP_SHOW	= 3000;		// Max time, in milliseconds, a card show be shown to the player

	this.QUESTION_MIN_INTERVAL	= 3000;		// Min time, in milliseconds, a question should remain active
	this.QUESTION_MAX_INTERVAL	= 10000;	// Max time, in milliseconds, a question should remain active
	this.QUESTION_MIN_FLIP_CARD	= 2000;		// Min time, in milliseconds, the game should wait until it flips a new card
	this.QUESTION_MAX_FLIP_CARD	= 4000;		// Max time, in milliseconds, the game should wait until it flips a new card
};
