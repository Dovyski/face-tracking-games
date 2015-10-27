/**
 * Describes the play state.
 */

var PlayState = function() {
	var mHud; 				// Game hud
	var mCards; 			// group with all the cards
	var mFlipTimer;			// interval, in seconds, between card flips
	var mQuestionTimer;		// interval, in seconds, between questions
	var mQuestion;			// Info about the current question
	var mMatchTime;			// Remaining time for the match
	var mUuid;				// Identifier for this player

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
		mMatchTime = Constants.GAME_MATCH_DURATION;

		// Define the current question. 'color' refer to the
		// expected color in the answer card, 'odd' refers if
		// the card number should be odd/even.
		mQuestion = {
			color: 1,
			odd: true
		};

		mHud = new Hud();
		Game.add.existing(mHud);

		mUuid = Game.rnd.uuid();
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

		var aEmotions = GlobalInfo.expression.getEmotions();

		// Emotions are available for reading?
		if(aEmotions.length > 0 && Constants.GAME_ENABLE_DATA_LOG) {
			// Yeah, they are, collect them
			GlobalInfo.data.log(aEmotions); // TODO: add game info here too
			GlobalInfo.data.send(GlobalInfo.uuid);
		}

		// Update match time
		mMatchTime -= Game.time.elapsed;

		if(mMatchTime <= 0) {
			// Match is over!
			Game.state.start('over');
		}
	};

	var flipRandomCard = function() {
		var aCard = mCards.getRandom();

		if(aCard) {
			aCard.flip();
		}
	};

	generateNewQuestion = function() {
		mQuestion.odd 	= Game.rnd.real() <= 0.5;
		mQuestion.color = Game.rnd.integerInRange(1, Constants.CARDS_COLORS.length - 1);

		mHud.refresh();
	};

	// Getters

	this.getQuestion = function() {
		return mQuestion;
	};

	this.getMatchRemainingTime = function() {
		return mMatchTime;
	};

	this.getHud = function() {
		return mHud;
	};
};
