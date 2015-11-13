/**
 * Describes the play state.
 */

var PlayState = function() {
	var mSelf = this;
	var mHud; 				// Game hud
	var mBackground;		// group with all the cards
	var mCards; 			// group with all the cards
	var mMonster;
	var mTrash;
	var mQuestionTime;		// Time, in seconds, the player has to answer the current question
	var mQuestionTimer;		// Counts from mQuestionTime until zero.
	var mQuestion;			// Info about the current question
	var mQuestionCounter;	// How many questions so far.
	var mMatchTime;			// Remaining time for the match
	var mIsThinking;		// Informs if the player is in a thinking part of the game (e.g. card analysis)
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
	var mDifficulty = {};
	var mTutorial;

	this.create = function() {
		var i,
			j = 0,
			aCard;

		mMonster = Game.add.sprite(Game.world.width * 0.85, Game.world.height * 0.42, 'monster');
		mMonster.animations.add('idle', [0,1], 2, true);
		mMonster.animations.add('sick', [2], 1, false);
		mMonster.animations.play('idle');

		mTrash = Game.add.sprite(Game.world.width * 0.85, mMonster.y + mMonster.height + 70, 'trash');

		mMonster.anchor.setTo(0.5);
		mTrash.anchor.setTo(0.5);

		mBackground = Game.add.sprite(Game.world.width * 0.05, Game.world.height * 0.15, 'deck-background');
		mCards = Game.add.group();

		for(i = 0; i < Constants.CARDS_MAX; i++) {
			if(i != 0 && (i % Constants.CARDS_PER_ROW) == 0) {
				j++;
			}

			aCard = new Card(mBackground.x + 70 + 120 * (i % Constants.CARDS_PER_ROW), mBackground.y + 60 + 120 * j);
			mCards.add(aCard);
		}

		mDifficulty['CARDS_FLIPS_TURN'] = Constants.CARDS_FLIPS_TURN;
		mDifficulty['QUESTION_DURATION'] = Constants.QUESTION_DURATION;

		mQuestionTime = mDifficulty['QUESTION_DURATION'];
		mQuestionTimer = 0;
		mMatchTime = Constants.GAME_MATCH_DURATION;
		mHealth = Constants.GAME_HEALTH_MAX;
		mSfxNewQuestion = Game.add.audio('sfx-new-question');
		mIsThinking = false;

		mQuestion = 1;
		mQuestionCounter = 0;

		mHud = new Hud();
		Game.add.existing(mHud);

		mTutorial = new Tutorial();
		Game.add.existing(mTutorial);

		mUuid = Game.rnd.uuid();
	};

	this.update = function() {
		var aElapsed = Game.time.elapsedMS;

		// Update everything related to turn control (time)
		// and generation of new questions.
		updateTurnAndNewQuestionControl(aElapsed);

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
			mHealth -= Constants.GAME_MISTAKE_HEALTH;
		}

		// Prevent overfeeding the monster.
		if(mHealth >= Constants.GAME_HEALTH_MAX) {
			mHealth = Constants.GAME_HEALTH_MAX;
		}

		mHud.refresh();
	}

	var updateTurnAndNewQuestionControl = function(theElapsed) {
		// Update counters regarding question
		mQuestionTimer -= theElapsed;

		// Check if it is time to ask a new question
		if(mQuestionTimer <= 0) {
			generateNewQuestion();
			mQuestionTime = mQuestionCounter == 1 ? Constants.QUESTION_DURATION_1ST : mDifficulty['QUESTION_DURATION'];
			mQuestionTimer = mQuestionTime;

			// Make the game a bit more harder for the next time :D
			increaseDifficultyLevel();
		}

		// If all cards have been analyzed already,
		// speed up the turn count down
		if(mIsThinking && mQuestionTimer > Constants.QUESTION_DOWN_TO && countFlippingCards() == 0) {
			mQuestionTimer *= 0.99;
		}
	};

	var flipRandomCardsUp = function() {
		var aCard,
		 	i,
			aTotal = mDifficulty['CARDS_FLIPS_TURN'];

		for(i = 0; i < aTotal; i++) {
			aCard = mCards.getRandom();

			if(aCard) {
				aCard.flip();
			}
		}
	};

	var penalizeStillFlippedUpCards = function() {
		var aCard,
			i,
			aTotal = mCards.length;

		for(i = 0; i < aTotal; i++) {
			aCard = mCards.getChildAt(i);

			if(aCard && aCard.isFlippedUp()) {
				mSelf.countMove('miss');
				mHud.showRightWrongSign(aCard, false);
				aCard.flipDown();
			}
		}
	};

	var countFlippingCards = function() {
		var aCard,
			i,
			aTotal = mCards.length,
			aRet = 0;

		for(i = 0; i < aTotal; i++) {
			aCard = mCards.getChildAt(i);

			if(aCard && (aCard.isFlippedUp() || aCard.isFlipping())) {
				aRet++;
			}
		}

		return aRet;
	};

	var clearTurnBasedScore = function() {
		mTurnBasedScore.right = 0;
		mTurnBasedScore.wrong = 0;
		mTurnBasedScore.miss = 0;
	};

	var flipCardsForNewRound = function() {
		// Is it the very first question the user sees?
		if(mQuestionCounter == 1) {
			// Yes! Let's flip some carefully selected cards
			// and show the tutorial info.
			mTutorial.activate();

		} else {
			// No, the player already saw the tutorial.
			// Let's go on with the show then.
			flipRandomCardsUp();

			if(mTutorial != null) {
				mTutorial.destroy();
				mTutorial = null;
			}
		}

		mIsThinking = true;
	};

	var generateNewQuestion = function() {
		mIsThinking = false;
		mQuestion = Game.rnd.integerInRange(1, Constants.CARDS_COLORS - 1);

		mHud.refresh();
		mHud.highlightNewQuestion();

		penalizeStillFlippedUpCards();
		clearTurnBasedScore();

		// Schedule the cards to flip up and the
		// thinking phase to begin.
		Game.time.events.add(Phaser.Timer.SECOND * 0.5, flipCardsForNewRound, this);

		mQuestionCounter++;

		mSfxNewQuestion.play();
	};

	var increaseDifficultyLevel = function() {
		var aProgress = 1 - mMatchTime / Constants.GAME_MATCH_DURATION;

		aProgress = aProgress < 0 ? 0 : aProgress;
		aProgress = aProgress > 1 ? 1 : aProgress;

		mDifficulty['CARDS_FLIPS_TURN']	= Math.floor(Constants.CARDS_FLIPS_TURN * (1 + aProgress * 3));
		mDifficulty['QUESTION_DURATION'] = Math.floor(Constants.QUESTION_DURATION * (1.2 - aProgress * 1.1));
	};

	// Getters

	this.getQuestion = function() {
		return mQuestion;
	};

	this.getCards = function() {
		return mCards;
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
