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
	var mMatchStartTime;	// When the match started
	var mIsThinking;		// Informs if the player is in a thinking part of the game (e.g. card analysis)
	var mHealth;			// Available health points.
	var mDifficultyIndex;	// Regulates the game difficulty.
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
		mTrash.addChild(new Phaser.Text(Game, -40, 70, 'Trash', {fontSize: 26, fill: '#000', align: 'center'}));

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

		mDifficultyIndex = 0;

		mQuestionTime = getDifficulty().QUESTION_DURATION;
		mQuestionTimer = 0;
		mMatchTime = Constants.GAME_MATCH_DURATION;
		mMatchStartTime = Date.now();
		mHealth = Constants.GAME_HEALTH_MAX;
		mSfxNewQuestion = Game.add.audio('sfx-new-question');
		mSfxNewQuestion.volume = Constants.SFX_VOLUME;
		mIsThinking = false;

		mQuestion = 1;
		mQuestionCounter = 0;

		mHud = new Hud();
		Game.add.existing(mHud);

		mTutorial = new Tutorial();
		Game.add.existing(mTutorial);

		//this.game.input.mouse.capture = true;
		this.game.input.mouse.mouseDownCallback = this.handleMouseEvents;
		this.game.input.mouse.mouseUpCallback = this.handleMouseEvents;
	};

	this.handleMouseEvents = function(theEvent) {
		if(GlobalInfo && GlobalInfo.data) {
			GlobalInfo.data.log({a: theEvent.type, x: this.input.x, y: this.input.y}, true);
		}
	};

	this.getTimeSinceMatchStarted = function() {
		return Date.now() - mMatchStartTime;
	};

	this.update = function() {
		var aElapsed = Game.time.elapsedMS,
			aOldDifficultyIndex;

		aOldDifficultyIndex = mDifficultyIndex;
		if(mTutorial == null) {
			updateDifficultiIndex();
		}

		if(aOldDifficultyIndex != mDifficultyIndex) {
			console.log('Difficulty has changed to ' + mDifficultyIndex);

			if(GlobalInfo && GlobalInfo.data) {
				GlobalInfo.data.log({a: 'difficulty', v: mDifficultyIndex}, true);
			}
		}

		// Update everything related to turn control (time)
		// and generation of new questions.
		updateTurnAndNewQuestionControl(aElapsed);

		if(GlobalInfo) {
			if(GlobalInfo.expression) {
				var aEmotions = GlobalInfo.expression.getEmotions();
				var aPoints = GlobalInfo.expression.getPoints();

				// Emotions are available for reading?
				if(aEmotions.length > 0) {
					// Yeah, they are, collect them
					GlobalInfo.data.log({e: aEmotions, p: aPoints});
				}
			}

			if(Constants.GAME_ENABLE_DATA_LOG) {
				GlobalInfo.data.log({s: mTurnBasedScore});
				GlobalInfo.data.send(GlobalInfo.user, GlobalInfo.game);
			}
		}

		// Update match time
		mMatchTime = Constants.GAME_MATCH_DURATION - this.getTimeSinceMatchStarted();

		if(mMatchTime <= 0 || mHealth <= 0) {
			// Match is over!
			if(GlobalInfo) {
				GlobalInfo.score = mScore;
			}
			// TODO: disable face tracking here
			Game.state.start('over');
		}
	};

	// theType can be 'right', 'wrong' or 'miss'
	this.countMove = function(theType) {
		if(theType == 'right') {
			mScore.right++;
			mTurnBasedScore.right++;
			mHealth += getDifficulty().GAME_CORRECT_HEALTH;

			if(GlobalInfo && GlobalInfo.data) {
				GlobalInfo.data.log({a: 'right'}, true);
			}

		} else if(theType == 'wrong') {
			mScore.wrong++;
			mTurnBasedScore.wrong++;
			mHealth -= getDifficulty().GAME_MISTAKE_HEALTH;

			if(GlobalInfo && GlobalInfo.data) {
				GlobalInfo.data.log({a: 'wrong'}, true);
			}

		} else {
			mScore.miss++;
			mTurnBasedScore.miss++;
			mHealth -= getDifficulty().GAME_MISTAKE_HEALTH;

			if(GlobalInfo && GlobalInfo.data) {
				GlobalInfo.data.log({a: 'miss'}, true);
			}
		}

		// Prevent overfeeding the monster.
		if(mHealth >= Constants.GAME_HEALTH_MAX) {
			mHealth = Constants.GAME_HEALTH_MAX;
		}

		mHud.refresh();
	}

	var updateDifficultiIndex = function() {
		mDifficultyIndex = (Constants.GAME_MATCH_DURATION - mMatchTime) / (Constants.GAME_MATCH_DURATION / Constants.DIFFICULTY.length);
		mDifficultyIndex |= 0; // cast to int
	};

	var updateTurnAndNewQuestionControl = function(theElapsed) {
		// Update counters regarding question
		mQuestionTimer -= theElapsed;

		// Check if it is time to ask a new question
		if(mQuestionTimer <= 0) {
			generateNewQuestion();
			mQuestionTime = mQuestionCounter == 1 ? Constants.QUESTION_DURATION_1ST : getDifficulty().QUESTION_DURATION;
			mQuestionTimer = mQuestionTime;

			if(GlobalInfo && GlobalInfo.data) {
				GlobalInfo.data.log({a: 'question'}, true);
			}
		}

		// If all cards have been analyzed already,
		// speed up the turn count down
		if(mIsThinking && countFlippingCards() == 0) {
			mQuestionTimer -= mQuestionCounter == 1 ? Constants.QUESTION_DOWN_PACE_1ST : getDifficulty().QUESTION_DOWN_PACE;
		}
	};

	var flipRandomCardsUp = function() {
		var aCard,
		 	i = 0,
			aTotal = getDifficulty().CARDS_FLIPS_TURN,
			aIsFirst,
			aIsLast;

		do {
			aCard = mCards.children[Game.rnd.integerInRange(0, mCards.children.length - 1)];

			if(aCard) {
				aIsFirst = i == 0;
				aIsLast  = i == aTotal - 1;

				if(aIsFirst) {
					// At least the first card must be poisonous
					aCard.flip(mQuestion);
				} else if(aIsLast) {
					// Last card should never be poisonous
					aCard.flip(generateQuestionValue(mQuestion));
				} else {
					// It's a card in between. Nothing special about it.
					aCard.flip();
				}

				i++;
			}
		} while (i < aTotal);
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
			// Is the tutorial active?
			if(mTutorial != null) {
				// Yeah, it is. Remove it because it's game time!
				mTutorial.destroy();
				mTutorial = null;

				// Reset match timer to ignore time spent during tutorial
				mMatchStartTime = Date.now();
				mMatchTime = Constants.GAME_MATCH_DURATION;
				updateDifficultiIndex();

				// Log start of the game
				GlobalInfo.data.logMilestone(GlobalInfo.user, GlobalInfo.game, 'game_start');
			}

			// No, the player already saw the tutorial.
			// Let's go on with the show then.
			flipRandomCardsUp();
		}

		mIsThinking = true;
	};

	var generateQuestionValue = function(theNotThisOne) {
		var aValue;

		do {
			aValue = Game.rnd.integerInRange(1, Constants.CARDS_COLORS - 1)

		} while(aValue == theNotThisOne);

		return aValue;
	};

	var generateNewQuestion = function() {
		mIsThinking = false;
		mQuestion = generateQuestionValue();

		mHud.refresh();
		mHud.highlightNewQuestion();

		penalizeStillFlippedUpCards();

		// Before clearing the turn based score, save information
		// regarding the current turn.
		if(GlobalInfo && GlobalInfo.data) {
			GlobalInfo.data.log({turn: mQuestionCounter, s: mTurnBasedScore}, true);
		}

		clearTurnBasedScore();

		// Schedule the cards to flip up and the
		// thinking phase to begin.
		Game.time.events.add(Phaser.Timer.SECOND * 0.5, flipCardsForNewRound, this);

		mQuestionCounter++;

		mSfxNewQuestion.play();
	};

	var getDifficulty = function() {
		return Constants.DIFFICULTY[mDifficultyIndex];
	};

	this.terminateCurrentTurn = function() {
		mQuestionTimer = 0;
	}

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
