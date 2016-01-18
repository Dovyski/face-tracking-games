/**
 * Describes the play state.
 */

var PlayState = function() {
	var mSelf = this,
		mHud, 				// Game hud
		mLevel,
		mPlayer,
		mMatchTime,			// Remaining time for the match
		mHealth,			// Available health points.
		mScore = {			// Info regarding global score (throughout the game session)
			right: 0,
			wrong: 0,
			miss: 0
		};

	this.create = function() {
		this.game.stage.backgroundColor = '#5FCDE4';

		// Init physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.setBoundsToWorld();
 		this.game.physics.arcade.gravity.y = 1000;
		this.game.time.desiredFps = 30;

		// Init entities
		mLevel = new Level(this.game);
		mPlayer = new Player(this.game);
		this.game.add.existing(mPlayer);

		// Init misc stuff
		mMatchTime = Constants.GAME_MATCH_DURATION;
		mHealth = Constants.GAME_HEALTH_MAX;

		mHud = new Hud();
		this.game.add.existing(mHud);

		if(GlobalInfo && GlobalInfo.data) {
			GlobalInfo.data.markGameStarted();
		}
	};

	this.updateTimeAndTracking = function() {
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
		mMatchTime -= this.game.time.elapsedMS;

		if(mMatchTime <= 0 || mHealth <= 0) {
			// Match is over!
			if(GlobalInfo) {
				GlobalInfo.score = mScore;
			}
			// TODO: disable face tracking here
			this.game.state.start('over');
		}

		if(GlobalInfo && GlobalInfo.data) {
			GlobalInfo.data.update();
		}
	};

	this.update = function() {
		var aKeyboard;

		this.updateTimeAndTracking();

		aKeyboard = this.game.input.keyboard;

	    if (aKeyboard.downDuration(Phaser.Keyboard.SPACEBAR, 10)) {
			if(aKeyboard.isDown(Phaser.Keyboard.UP, 10)) {
		        mPlayer.jump();

			} else if(aKeyboard.isDown(Phaser.Keyboard.DOWN, 10)){
				mPlayer.dash();
			}
	    }

		if (!mPlayer.jumping) {
			this.game.physics.arcade.collide(mPlayer, mLevel.getFloor(), function() {
				if(!mPlayer.dashing) {
					mPlayer.animations.play('run');
				}
			}, null, this);
		}

		this.game.physics.arcade.overlap(mPlayer, mLevel.getSlopes(), this.handleMovesOnSlopes);
		this.game.physics.arcade.overlap(mPlayer, mLevel.getObstacles(), this.handleObstacleOverlap);
	};

	this.handleObstacleOverlap = function(thePlayer, theObstacle) {
		thePlayer.hurt();
	};

	this.handleMovesOnSlopes = function(thePlayer, theSlope) {
		var aScale;

		aScale = (thePlayer.x - theSlope.x) / theSlope.width;

		if(theSlope.key == 'slope-up') {
			if(aScale >= 0.1 && aScale <= 0.75) {
				thePlayer.y = theSlope.y - (theSlope.height / 2 + aScale * theSlope.height);
			}
		} else {
			if(aScale >= 0.25 && aScale <= 0.6) {
				thePlayer.y = theSlope.y - theSlope.height / 2 - 40 + aScale * (theSlope.height / 2);

			}
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
