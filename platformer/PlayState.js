/**
 * Describes the play state.
 */

PlayState = function() {
	var mSelf = this,
		mHud, 				// Game hud
		mLevel,
		mPlayer,
		mMatchTime,			// Remaining time for the match
		mMatchStartTime,	// When the match started
		mDustEmitter,
		mDifficultyIndex,
		mSfxHeal,
		mSfxMusic,
		mScore = {			// Info regarding global score (throughout the game session)
			collectable: 0, // Amount of collectables (e.g. hearts) the player collected
			overcome: 0,	// Number of obstacles the player successfully overcame (jumped over or slided below)
			hurt: 0			// Number of times the player got hit by obstacles
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

		// Dust emitter
		mDustEmitter = this.game.add.emitter(this.game, 0, 0, 100);
		mDustEmitter.particleClass = Dust;
		mDustEmitter.gravity = -70;
		mDustEmitter.minParticleSpeed.set(-100, -50);
		mDustEmitter.maxParticleSpeed.set(-300, -150);
		mDustEmitter.setRotation(0, 0);
		mDustEmitter.makeParticles();
		mPlayer.setDustEmitter(mDustEmitter);

		mDifficultyIndex = 0;

		// Init misc stuff
		mMatchStartTime = Date.now();
		mMatchTime = Constants.GAME_MATCH_DURATION;
		this.game.add.existing(mLevel.getForeground());

		mHud = new Hud();
		this.game.add.existing(mHud);

		// SFX and music
		mSfxHeal = this.game.add.audio('sfx-heart');
		mSfxMusic = this.game.add.audio('sfx-music', Constants.MUSIC_VOLUME, true);

		mSfxHeal.volume = Constants.SFX_VOLUME;
		mSfxMusic.volume = Constants.MUSIC_VOLUME;

		// Start title music as soon as possible
		this.game.sound.setDecodedCallback([mSfxMusic], function() {
			mSfxMusic.play();

		}, this);
	};

	this.getTimeSinceMatchStarted = function() {
		return Date.now() - mMatchStartTime;
	};

	this.updateTimeAndTracking = function() {
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
				GlobalInfo.data.log({s: mScore});
				GlobalInfo.data.send(GlobalInfo.user, GlobalInfo.game);
			}
		}

		// Update match time
		mMatchTime = Constants.GAME_MATCH_DURATION - this.getTimeSinceMatchStarted();

		if(mMatchTime <= 0 || mPlayer.getHealth() <= 0) {
			// Match is over!
			if(GlobalInfo) {
				GlobalInfo.score = mScore;
			}
			// TODO: disable face tracking here
			mSfxMusic.stop();
			mSfxMusic.destroy();
			this.game.state.start('over');
		}
	};

	this.update = function() {
		var aKeyboard,
			aOldDifficultyIndex,
			aPlayerObstacle;

		this.updateTimeAndTracking();

		// Calculate the difficulty index based on the game duration
		aOldDifficultyIndex = mDifficultyIndex;
		mDifficultyIndex = (Constants.GAME_MATCH_DURATION - mMatchTime) / (Constants.GAME_MATCH_DURATION / Constants.DIFFICULTY.length);
		mDifficultyIndex |= 0; // cast to int

		if(aOldDifficultyIndex != mDifficultyIndex) {
			console.log('Difficulty has changed to ' + mDifficultyIndex);

			if(GlobalInfo && GlobalInfo.data) {
				GlobalInfo.data.log({a: 'difficulty', v: mDifficultyIndex}, true);
			}
		}

		aKeyboard = this.game.input.keyboard;

		if(aKeyboard.isDown(Phaser.Keyboard.UP, 10)) {
	        mPlayer.jump();

		} else if(aKeyboard.isDown(Phaser.Keyboard.S, 10)){
			mPlayer.dash();
		}

		mPlayer.adjustPosition(mLevel.getCurrentPlayerFloor());

		this.game.physics.arcade.overlap(mPlayer, mLevel.getObstacles(), this.handleObstacleOverlap, null, this);
		this.game.physics.arcade.overlap(mPlayer, mLevel.getCollectables(), this.handleCollectable, null, this);
	};

	this.handleCollectable = function(thePlayer, theCollectable) {
		var aTween;

		if(theCollectable.alive) {
			theCollectable.alive = false;
			mScore.collectable++;
			mSfxHeal.play();

			aTween = this.game.add.tween(theCollectable).to(mHud.getHeartIconPosition(), 500, Phaser.Easing.Linear.None, true);

			if(GlobalInfo && GlobalInfo.data) {
				GlobalInfo.data.log({a: 'collectable'}, true);
			}

			aTween.onComplete.add(function(theItem) {
				theItem.kill();
				thePlayer.heal(this.getDifficulty().heal);
				mHud.refresh();
			}, this);
		}
	};

	this.handleObstacleOverlap = function(thePlayer, theObstacle) {
		if(!theObstacle.touched && (theObstacle.key != 'obstacle-top' || !thePlayer.dashing)) {
			// Mark the obstacle as touched by the player, so it
			// will not be handled again in the collision or
			// generate score points.
			theObstacle.touched = true;

			mScore.hurt++;
			thePlayer.hurt(this.getDifficulty().hurt);
			mHud.refresh();

			if(GlobalInfo && GlobalInfo.data) {
				GlobalInfo.data.log({a: 'hurt'}, true);
			}
		}
	};

	this.handleObstacleRemoval = function(theObstacle) {
		if(!theObstacle.touched) {
			// An obstacle just went outside the screen without
			// being touched by the player. Let's score that.
			mScore.overcome++;

			if(GlobalInfo && GlobalInfo.data) {
				GlobalInfo.data.log({a: 'overcome'}, true);
			}
		}
	};

	this.render = function() {
		if(!Constants.GAME_DEBUG) return;

		this.game.debug.body(mPlayer);

		mLevel.getObstacles().forEachAlive(function(theItem) {
			this.game.debug.body(theItem);
		}, this);
	};

	// Getters

	this.getScore = function() {
		return mScore;
	};

	this.getDifficulty = function() {
		return mDifficultyIndex >= 0 && mDifficultyIndex < Constants.DIFFICULTY.length ? Constants.DIFFICULTY[mDifficultyIndex] : Constants.DIFFICULTY[Constants.DIFFICULTY.length - 1];
	};

	this.getHud = function() {
		return mHud;
	};

	this.getPlayer = function() {
		return mPlayer;
	};
};
