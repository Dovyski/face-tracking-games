/**
 * Describes the play state.
 */

var PlayState = function() {
	var mSelf = this;
	var mHud; 				// Game hud
	var mBackground;		// group with all the cards
	var mMatchTime;			// Remaining time for the match
	var mHealth;			// Available health points.
	var mTutorial;
	var mScore = {			// Info regarding global score (throughout the game session)
		right: 0,
		wrong: 0,
		miss: 0
	};

	this.create = function() {
		mMatchTime = Constants.GAME_MATCH_DURATION;
		mHealth = Constants.GAME_HEALTH_MAX;

		mHud = new Hud();
		Game.add.existing(mHud);

		mTutorial = new Tutorial();
		Game.add.existing(mTutorial);

		if(GlobalInfo && GlobalInfo.data) {
			GlobalInfo.data.markGameStarted();
		}
	};

	this.update = function() {
		var aElapsed = Game.time.elapsedMS;

		if(GlobalInfo && GlobalInfo.expression) {
			var aEmotions = GlobalInfo.expression.getEmotions();
			var aPoints = GlobalInfo.expression.getPoints();

			// Emotions are available for reading?
			if(aEmotions.length > 0 && Constants.GAME_ENABLE_DATA_LOG) {
				// Yeah, they are, collect them
				GlobalInfo.data.log({e: aEmotions, p: aPoints, s: mScore});
				GlobalInfo.data.send(GlobalInfo.uuid, GlobalInfo.game);
			}
		}

		// Update match time
		mMatchTime -= aElapsed;

		if(mMatchTime <= 0 || mHealth <= 0) {
			// Match is over!
			if(GlobalInfo) {
				GlobalInfo.score = mScore;
			}
			// TODO: disable face tracking here
			Game.state.start('over');
		}

		if(GlobalInfo && GlobalInfo.data) {
			GlobalInfo.data.update();
		}
	};

	// theType can be 'right', 'wrong' or 'miss'
	this.countMove = function(theType) {
		if(theType == 'right') {
			mScore.right++;
			mHealth += Constants.GAME_CORRECT_HEALTH;

		} else if(theType == 'wrong') {
			mScore.wrong++;
			mHealth -= Constants.GAME_MISTAKE_HEALTH;

		} else {
			mScore.miss++;
			mHealth -= Constants.GAME_MISTAKE_HEALTH;
		}

		// Prevent overfeeding health
		if(mHealth >= Constants.GAME_HEALTH_MAX) {
			mHealth = Constants.GAME_HEALTH_MAX;
		}

		mHud.refresh();
	}


	// Getters

	this.getScore = function() {
		return mScore;
	};

	this.getMatchRemainingTime = function() {
		return mMatchTime;
	};

	this.getHud = function() {
		return mHud;
	};

	this.getHealthPercentage = function() {
		return mHealth/Constants.GAME_HEALTH_MAX;
	};
};
