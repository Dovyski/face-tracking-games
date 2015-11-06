/**
 * A class with all constants in the game
 */

var Constants = new function() {
	this.GAME_WIDTH 			= 1024;
	this.GAME_HEIGHT 			= 768;
	this.GAME_MATCH_DURATION	= 2 * 60 * 1000; // Duration, in milliseconds, of a single match.
	this.GAME_ENABLE_DATA_LOG	= true; 	// Defines if the game should collect and send anonymous data regarding usage
	this.GAME_HEALTH_MAX		= 100; 		// Max health points available in the game.
	this.GAME_MISTAKE_HEALTH	= 5; 		// How many health point you loose when you make a mistake.
	this.GAME_CORRECT_HEALTH	= 1; 		// How many health point you win when you make a mistake.

	this.CARDS_MAX 				= 25;		// Total number of cards in the game
	this.CARDS_PER_ROW 			= 5;		// Amount of cards in each row
	this.CARDS_MAX_NUMBER		= 99;		// The heightest number to be displayed in a card
	this.CARDS_MIN_FLIPS_TURN	= 2;		// Min amount of cards that will will be flipped every time a new question is generated.
	this.CARDS_MAX_FLIPS_TURN	= 5;		// Max amount of cards that will will be flipped every time a new question is generated.
	this.CARDS_MIN_FLIP_SHOW	= 2000;		// Min time, in milliseconds, a card show be shown to the player
	this.CARDS_MAX_FLIP_SHOW	= 4000;		// Max time, in milliseconds, a card show be shown to the player

	this.CARDS_COLORS			= [			// Information regarding card colors. Position is important (check frames in assets/card.png)
		{value: '#000000', name: 'none'  },
		{value: '#ff0000', name: 'Red'   },
		{value: '#00ff00', name: 'Green' },
		{value: '#0000ff', name: 'Blue'  }
	];

	this.QUESTION_MIN_INTERVAL	= 3000;		// Min time, in milliseconds, a question should remain active
	this.QUESTION_MAX_INTERVAL	= 7000;		// Max time, in milliseconds, a question should remain active
	this.QUESTION_MIN_FLIP_CARD	= 2000;		// Min time, in milliseconds, the game should wait until it flips a new card
	this.QUESTION_MAX_FLIP_CARD	= 3000;		// Max time, in milliseconds, the game should wait until it flips a new card

	this.HUD_RIGHT_WRONG_TTL	= 1000;		// Time, in milliseconds, the "right/wrong" sign remains on the screen.
};
