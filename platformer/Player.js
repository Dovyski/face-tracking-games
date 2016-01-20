/**
 * This class describes the player's character.
 */
Player = function (theGame) {
    // Properties
    this.dashing,
    this.mDashTimer;
    this.mHealth;
    this.mFlickeringTimer;
    this.mTouchingFloor;
    this.mVelocity;
    this.mAcceleration;
    this.mDustEmitter;

    // Constructor
    Phaser.Sprite.call(this, theGame, theGame.width * 0.15, theGame.world.centerY + 10, 'player');
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// Public methods

Player.prototype.init = function() {
    this.animations.add('run', [0, 1, 2, 3, 4, 5], 10, true);
    this.animations.add('jump', [6, 7, 8, 8, 9, 10], 5, true);
    this.animations.add('dash', [11], 5, true);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    this.dashing = false;
    this.mDashTimer = 0;
    this.mTouchingFloor = false;
    this.mHealth = Constants.GAME_HEALTH_MAX;
    this.mVelocity = new Phaser.Point();
    this.mAcceleration = new Phaser.Point(0, 1);

    this.run();
};

Player.prototype.update = function() {
    this.x = this.game.width * Constants.PLAYER_POSITION_X;

    this.adjustDustEmitterPosition();

    if(this.dashing) {
        this.mDashTimer -= this.game.time.elapsedMS;

        if(this.mDashTimer <= 0) {
            this.dashing = false;
            this.mDustEmitter.on = false;
            this.run();
        }
    }

    if(this.mFlickeringTimer > 0) {
        this.mFlickeringTimer -= this.game.time.elapsedMS;

        this.visible = !this.visible;

        if(this.mFlickeringTimer <= 0) {
            this.visible = true;
        }
    }
};

Player.prototype.adjustDustEmitterPosition = function() {
    this.mDustEmitter.x = this.x + 40;
    this.mDustEmitter.y = this.y + this.body.height;
};

Player.prototype.adjustPosition = function(theCurrentFloor) {
    // Euler interpolation
    this.mVelocity.y += this.mAcceleration.y;
    this.mVelocity.y = this.mVelocity.y > 200 ? 200 : this.mVelocity.y;

    this.y += this.mVelocity.y;

    // Are we touching the floor?
    if(this.y + this.body.height > theCurrentFloor.y) {
        // Yep, we are. Is it a slope?
        if(this.mTouchingFloor == false) {
            // About to land from jump, let's emit some dust
            this.adjustDustEmitterPosition();
            this.mDustEmitter.start(false, 1000, 500, 2, 2);
        }
        this.mTouchingFloor = true;

        // Check it the floor is a slope
        if(theCurrentFloor.key == 'slope-up' || theCurrentFloor.key == 'slope-down') {
            // Yep, handle the up/down movement.
            this.processMoveOnSlope(theCurrentFloor);

        } else {
            // No, it's a flat platform.
    		this.y = theCurrentFloor.y - this.body.height;

            if(!this.dashing) {
                this.run();
            }
        }
    } else {
        this.mTouchingFloor = false;
    }
};

Player.prototype.processMoveOnSlope = function(theSlope) {
    var aScale;

    aScale = (this.x - theSlope.x) / theSlope.width;

    if(theSlope.key == 'slope-up') {
        if(aScale <= 0.5) {
            this.run();
            this.y = theSlope.y - (theSlope.height / 2 + aScale * theSlope.height * 0.7);
        } else {
            this.y = theSlope.y - this.body.height;
        }
    } else {
        if(aScale <= 0.6) {
            this.run();
            this.y = theSlope.y - theSlope.height / 2 - 40 + aScale * (theSlope.height / 2);
        } else {
            this.y = theSlope.y - 60;
        }
    }
};

Player.prototype.run = function() {
    if(this.animations.currentAnim.name != "run") {
        this.body.setSize(20, 120, 30, 0);
        this.anchor.set(0);
        this.angle = 0;
        this.animations.play('run');
    }
};

Player.prototype.jump = function() {
    if(this.mTouchingFloor) {
        this.run(); // to prevent any dash rotation/animation
        this.animations.play('jump');
        this.mVelocity.y = -15;
    }
};

Player.prototype.dash = function() {
    if(!this.dashing && this.mTouchingFloor) {
        this.dashing = true;
        this.animations.play('dash');
        this.body.setSize(100, 30, 0, 0);
        this.anchor.set(0.5);
        this.angle = -90;
        this.y += this.height;

        this.mDashTimer = 50;

        // Emit some dust \o/
        this.mDustEmitter.start(false, 1000, 50);

    } else if(this.dashing) {
        // If the player is already dashing and more of it
        // is requested, we just increase the dashing timer.
        this.mDashTimer = 50;
    }
};

Player.prototype.heal = function() {
    this.mHealth += Constants.GAME_CORRECT_HEALTH;

    // Prevent overfeeding health
    if(this.mHealth >= Constants.GAME_HEALTH_MAX) {
        this.mHealth = Constants.GAME_HEALTH_MAX;
    }
};

Player.prototype.hurt = function() {
    if(!this.isFlickering()) {
        this.mHealth -= Constants.GAME_MISTAKE_HEALTH;

        if(this.mHealth < 0) {
            this.mHealth = 0;
        }

        this.flicker(1000);
    }
};

Player.prototype.flicker = function(theDuration) {
    this.mFlickeringTimer = theDuration
};

Player.prototype.isFlickering = function() {
    return this.mFlickeringTimer > 0;
};

Player.prototype.getHealth = function() {
    return this.mHealth;
};

Player.prototype.getHealthPercentage = function() {
    return this.mHealth / Constants.GAME_HEALTH_MAX;
};

Player.prototype.setDustEmitter = function(theEmitter) {
    this.mDustEmitter = theEmitter;
    this.adjustDustEmitterPosition();
};
