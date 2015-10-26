/**
 * Describes the play state.
 */

var PlayState = function() {
	var mCards; 			// group with all the cards
	var mFlipTimer;			// interval, in seconds, between card flips
	var mQuestionTimer;		// interval, in seconds, between questions
	var mQuestion;			// Info about the current question

	this.create = function() {
		var i,
			j = 0,
			aCard;

		mCards = Game.add.group();

		for(i = 0; i < Constants.CARDS_MAX; i++) {
			if(i != 0 && (i % Constants.CARDS_PER_ROW) == 0) {
				j++;
			}

			aCard = new Card(Game.world.width * 0.15 + 160 * (i % Constants.CARDS_PER_ROW), Game.world.height * 0.15 + 230 * j);
			mCards.add(aCard);
		}

		mFlipTimer = 0;
		mQuestionTimer = 0;

		// Define the current question. 'color' refer to the
		// expected color in the answer card, 'odd' refers if
		// the card number should be odd/even.
		mQuestion = {
			color: 1,
			odd: true
		};
	};

	this.update = function() {
		// Update counters regarding quesitons and card flips
		mFlipTimer -= Game.time.elapsed;
		mQuestionTimer -= Game.time.elapsed;

		// Check if it is time to flip a new card
		if(mFlipTimer <= 0) {
			flipRandomCard();
			mFlipTimer = Game.rnd.realInRange(Constants.QUESTION_MIN_FLIP_CARD, Constants.QUESTION_MAX_FLIP_CARD);
		}

		// Check if it is time to ask a new question
		if(mQuestionTimer <= 0) {
			generateNewQuestion();
			mQuestionTimer = Game.rnd.realInRange(Constants.QUESTION_MIN_INTERVAL, Constants.QUESTION_MAX_INTERVAL);
		}
	};

	var flipRandomCard = function() {
		var aCard = mCards.getRandom();

		if(aCard) {
			aCard.flip();
		}
	};

	generateNewQuestion = function() {
		console.log('Change question');
	};

	this.preload = function() {
		Game.load.spritesheet('card', 'assets/card.png', 145, 207); // By jeffshee, CC-BY 3.0, http://opengameart.org/content/colorful-poker-card-back
	};
};
