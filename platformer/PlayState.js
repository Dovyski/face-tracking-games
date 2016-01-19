/**
 * Describes the play state.
 */

PlayState = function() {
	var mSelf = this,
		mHud, 				// Game hud
		mLevel,
		mPlayer,
		mMatchTime,			// Remaining time for the match
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
		this.game.time.desiredFps = 30;

		// Init entities
		mLevel = new Level(this.game);
		mPlayer = new Player(this.game);
		this.game.add.existing(mPlayer);

		// Init misc stuff
		mMatchTime = Constants.GAME_MATCH_DURATION;

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

		if(mMatchTime <= 0 || mPlayer.getHealth() <= 0) {
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

	    if (aKeyboard.isDown(Phaser.Keyboard.SPACEBAR, 10)) {
			if(aKeyboard.isDown(Phaser.Keyboard.UP, 10)) {
		        mPlayer.jump();

			} else if(aKeyboard.isDown(Phaser.Keyboard.DOWN, 10)){
				mPlayer.dash();
			}
	    }

		mPlayer.adjustPosition(mLevel.getCurrentPlayerFloor());

		this.game.physics.arcade.overlap(mPlayer, mLevel.getObstacles(), this.handleObstacleOverlap);
	};

	this.handleObstacleOverlap = function(thePlayer, theObstacle) {
		thePlayer.hurt();
		mScore.wrong++;

		mHud.refresh();
	};

	this.render = function() {
		//this.game.debug.body(mPlayer);
		//this.game.debug.body(mLevel.getCurrentPlayerFloor());
	};

	// Getters

	this.getScore = function() {
		return mScore;
	};

	this.getHud = function() {
		return mHud;
	};

	this.getPlayer = function() {
		return mPlayer;
	};
};
