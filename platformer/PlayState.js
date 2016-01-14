/**
 * Describes the play state.
 */

var PlayState = function() {
	var mSelf = this;
	var mHud; 				// Game hud
	var mBackground;		// group with all the cards
	var mPlayer;
	var mJumpTimer;
	var mControls;
	var mActionKey;
	var mMatchTime;			// Remaining time for the match
	var mHealth;			// Available health points.
	var mScore = {			// Info regarding global score (throughout the game session)
		right: 0,
		wrong: 0,
		miss: 0
	};

	this.create = function() {
		mBackground = this.game.add.sprite(0, 0, 'background');

		// Init physics
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
 		this.game.physics.arcade.gravity.y = 250;
		this.game.time.desiredFps = 30;

		// Init player
		mPlayer = this.game.add.sprite(32, 32, 'heart');
	    this.game.physics.enable(mPlayer, Phaser.Physics.ARCADE);

	    mPlayer.body.bounce.y = 0.2;
	    mPlayer.body.collideWorldBounds = true;
	    mPlayer.body.setSize(20, 32, 5, 16);

	    mPlayer.animations.add('left', [0], 10, true);
	    mPlayer.animations.add('turn', [0], 20, true);
	    mPlayer.animations.add('right', [0], 10, true);

		// Init input
	    mControls = this.game.input.keyboard.createCursorKeys();
	    mActionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		// Init misc stuff
		mMatchTime = Constants.GAME_MATCH_DURATION;
		mHealth = Constants.GAME_HEALTH_MAX;
		mJumpTimer = 0;

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
		this.updateTimeAndTracking();

		mPlayer.body.velocity.x = 0;

	    if(mControls.left.isDown) {
	        mPlayer.body.velocity.x = -150;

	        if(mPlayer.facing != 'left') {
	            mPlayer.animations.play('left');
	            mPlayer.facing = 'left';
	        }

	    } else if(mControls.right.isDown) {
	        mPlayer.body.velocity.x = 150;

	        if(mPlayer.facing != 'right') {
	            mPlayer.animations.play('right');
	            mPlayer.facing = 'right';
	        }
	    } else if (mPlayer.facing != 'idle') {
        	mPlayer.animations.stop();
            mPlayer.frame = mPlayer.facing == 'left' ? 0 : 5;
            mPlayer.facing = 'idle';
	    }

	    if (mActionKey.isDown && mPlayer.body.onFloor() && this.game.time.now > mJumpTimer) {
	        mPlayer.body.velocity.y = -250;
	        mJumpTimer = this.game.time.now + 750;
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
