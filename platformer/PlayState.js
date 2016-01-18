/**
 * Describes the play state.
 */

var PlayState = function() {
	var mSelf = this,
		mHud, 				// Game hud
		mLevel,
		mPlayer,
		mJumping,
		mDashing,
		mActionTimer,
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
		this.initPlayer();

		// Init misc stuff
		mMatchTime = Constants.GAME_MATCH_DURATION;
		mHealth = Constants.GAME_HEALTH_MAX;
		mJumping = false;
		mDashing = false;
		mActionTimer = 0;

		mHud = new Hud();
		this.game.add.existing(mHud);

		if(GlobalInfo && GlobalInfo.data) {
			GlobalInfo.data.markGameStarted();
		}
	};

	this.initPlayer = function() {
		mPlayer = this.game.add.sprite(50, this.game.width * 0.15, 'player');

		mPlayer.animations.add('run', [0, 1, 2, 3, 4, 5], 10, true);
		mPlayer.animations.add('jump', [6, 7, 8, 8, 9, 10], 5, true);
		mPlayer.animations.play('run');

		this.game.physics.enable(mPlayer, Phaser.Physics.ARCADE);
		mPlayer.body.collideWorldBounds = true;
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

		mPlayer.body.velocity.x = 0;
		mPlayer.x = this.game.width * 0.15;
		aKeyboard = this.game.input.keyboard;

		if(mJumping || mDashing) {
			mActionTimer -= this.game.time.elapsedMS;

			if(mActionTimer <= 0) {
				mJumping = false;
				mDashing = false;
				mPlayer.animations.play('run');
			}
		}

	    if (aKeyboard.downDuration(Phaser.Keyboard.SPACEBAR, 10)) {
			if(!mJumping && aKeyboard.isDown(Phaser.Keyboard.UP, 10)) {
				mJumping = true;
				mActionTimer = 500;
		        mPlayer.animations.play('jump');
				mPlayer.body.velocity.y = -500;

			} else if(!mJumping && aKeyboard.isDown(Phaser.Keyboard.DOWN, 10)){
				mDashing = true;
				mActionTimer = 500;
				mPlayer.animations.play('jump');
			}
	    }

		if (!mJumping) {
			this.game.physics.arcade.collide(mPlayer, mLevel.getFloor());
		}

		this.game.physics.arcade.overlap(mPlayer, mLevel.getSlopes(), this.handleMovesOnSlopes);
	};

	this.handleMovesOnSlopes = function(thePlayer, theSlope) {
		var aScale;

		aScale = (thePlayer.x - theSlope.x) / theSlope.width;

		if(theSlope.key == 'slope-up') {
			if(aScale < 0.1) {
				thePlayer.y = theSlope.y - theSlope.height / 2;

			} else if(aScale >= 0.1 && aScale <= 0.6) {
				thePlayer.y = theSlope.y - (theSlope.height / 2 + aScale * theSlope.height);
			}
		} else {
			if(aScale >= 0.25 && aScale <= 0.6) {
				thePlayer.y = theSlope.y - theSlope.height / 2 - 40 + aScale * (theSlope.height / 2);

			} else if(aScale > 0.6) {
				thePlayer.y = theSlope.y - theSlope.height / 2;
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
