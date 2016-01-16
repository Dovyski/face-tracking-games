/**
 * Describes the play state.
 */

var PlayState = function() {
	var mSelf = this;
	var mHud; 				// Game hud
	var mLevel;
	var mPlayer;
	var mMatchTime;			// Remaining time for the match
	var mHealth;			// Available health points.
	var mScore = {			// Info regarding global score (throughout the game session)
		right: 0,
		wrong: 0,
		miss: 0
	};

	this.create = function() {
		this.game.stage.backgroundColor = '#5FCDE4';

		// Init physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.setBoundsToWorld();
 		this.game.physics.arcade.gravity.y = 300;
		this.game.time.desiredFps = 30;

		// Init entities
		mLevel = new Level(this.game);
		this.initPlayer();

		// Init misc stuff
		mMatchTime = Constants.GAME_MATCH_DURATION;
		mHealth = Constants.GAME_HEALTH_MAX;

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
		this.updateTimeAndTracking();

		mPlayer.body.velocity.x = 0;
		mPlayer.x = this.game.width * 0.15;

	    if (this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 10)) {
			//if(mControls.up.isDown) {
		        mPlayer.animations.play('jump');
				mPlayer.y -= 50;
				mPlayer.body.velocity.y = -350;
				console.log('sdsdsd');

		    //} else if(mControls.down.isDown) {
			//	mPlayer.animations.play('duck');
			//}
	    }

		if (!this.game.input.keyboard.downDuration(Phaser.Keyboard.SPACEBAR, 10)) {
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
