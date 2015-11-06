/**
 * Describes the play state.
 */

var PlayState = function() {
	var mHud; 				// Game hud
	var mBackground;		// group with all the cards
	var mCards; 			// group with all the cards
	var mMonster;
	var mTrash;
	var mQuestionTime;		// Time, in seconds, the player has to answer the current question
	var mQuestionTimer;		// Counts from mQuestionTime until zero.
	var mQuestion;			// Info about the current question
	var mMatchTime;			// Remaining time for the match
	var mHealth;			// Available health points.
	var mUuid;				// Identifier for this player
	var mScore = {			// Info regarding global score (throughout the game session)
		right: 0,
		wrong: 0,
		miss: 0
	};
	var mTurnBasedScore = {		// Info regarding score for each new question
		right: 0,
		wrong: 0,
		miss: 0
	};
	var mSfxNewQuestion;

	this.create = function() {
		var i,
			j = 0,
			aCard;

		mMonster = Game.add.sprite(Game.world.width * 0.85, Game.world.height * 0.4, 'question-dialog');
		mTrash = Game.add.sprite(Game.world.width * 0.85, Game.world.height * 0.6, 'question-dialog');

		mMonster.anchor.setTo(0.5);
		mTrash.anchor.setTo(0.5);

		mBackground = Game.add.sprite(Game.world.width * 0.05, Game.world.height * 0.12, 'deck-background');
		mCards = Game.add.group();

		for(i = 0; i < Constants.CARDS_MAX; i++) {
			if(i != 0 && (i % Constants.CARDS_PER_ROW) == 0) {
				j++;
			}

			aCard = new Card(mBackground.x + 70 + 120 * (i % Constants.CARDS_PER_ROW), mBackground.y + 60 + 120 * j);
			mCards.add(aCard);
		}

		mQuestionTime = Constants.QUESTION_DURATION;
		mQuestionTimer = 0;
		mMatchTime = Constants.GAME_MATCH_DURATION;
		mHealth = Constants.GAME_HEALTH_MAX;
		mSfxNewQuestion = Game.add.audio('sfx-new-question');

		mQuestion = 1;

		mHud = new Hud();
		Game.add.existing(mHud);

		mUuid = Game.rnd.uuid();
	};

	this.update = function() {
		var aElapsed = Game.time.elapsedMS;

		// Update counters regarding question
		mQuestionTimer -= aElapsed;

		// Check if it is time to ask a new question
		if(mQuestionTimer <= 0) {
			generateNewQuestion();
			mQuestionTime = Constants.QUESTION_DURATION; // TODO: adjust according to level difficulty
			mQuestionTimer = mQuestionTime;
		}

		var aEmotions = GlobalInfo.expression.getEmotions();

		// Emotions are available for reading?
		if(aEmotions.length > 0 && Constants.GAME_ENABLE_DATA_LOG) {
			// Yeah, they are, collect them
			GlobalInfo.data.log({e: aEmotions, s: mTurnBasedScore});
			GlobalInfo.data.send(GlobalInfo.uuid, GlobalInfo.game);
		}

		// Update match time
		mMatchTime -= aElapsed;

		if(mMatchTime <= 0 || mHealth <= 0) {
			// Match is over!
			GlobalInfo.score = mScore;
			// TODO: disable face tracking here
			Game.state.start('over');
		}
	};

	// theType can be 'right', 'wrong' or 'miss'
	this.countMove = function(theType) {
		if(theType == 'right') {
			mScore.right++;
			mTurnBasedScore.right++;
			mHealth += Constants.GAME_CORRECT_HEALTH;

		} else if(theType == 'wrong') {
			mScore.wrong++;
			mTurnBasedScore.wrong++;
			mHealth -= Constants.GAME_MISTAKE_HEALTH;

		} else {
			mScore.miss++;
			mTurnBasedScore.miss++;
		}

		mHud.refresh();
	}

	var flipRandomCardsUp = function() {
		var aCard,
		 	i,
			aTotal = Game.rnd.integerInRange(Constants.CARDS_MIN_FLIPS_TURN, Constants.CARDS_MAX_FLIPS_TURN);

		for(i = 0; i < aTotal; i++) {
			aCard = mCards.getRandom();

			if(aCard) {
				aCard.flip();
			}
		}
	};

	var flipAllCardsDown = function() {
		var aCard,
			i,
			aTotal = mCards.length;

		for(i = 0; i < aTotal; i++) {
			aCard = mCards.getChildAt(i);

			if(aCard && aCard.isFlippedUp()) {
				aCard.flipDown();
			}
		}
	};

	var clearTurnBasedScore = function() {
		mTurnBasedScore.right = 0;
		mTurnBasedScore.wrong = 0;
		mTurnBasedScore.miss = 0;
	};

	var generateNewQuestion = function() {
		mQuestion = Game.rnd.integerInRange(1, Constants.CARDS_COLORS - 1);

		mHud.refresh();
		mHud.highlightNewQuestion();

		clearTurnBasedScore();
		flipAllCardsDown();
		Game.time.events.add(Phaser.Timer.SECOND * 0.5, flipRandomCardsUp, this);

		mSfxNewQuestion.play();
	};

	// Getters

	this.getQuestion = function() {
		return mQuestion;
	};

	this.getScore = function() {
		return mScore;
	};

	this.getMatchRemainingTime = function() {
		return mMatchTime;
	};

	this.getHud = function() {
		return mHud;
	};

	this.getMonster = function() {
		return mMonster;
	};

	this.getPercentageTimeRemainingAnswerQuestion = function() {
		return mQuestionTimer / mQuestionTime;
	};

	this.getTrash = function() {
		return mTrash;
	};

	this.getHealthPercentage = function() {
		return mHealth/Constants.GAME_HEALTH_MAX;
	};
};
