/**
 * This class describes a game level (scene).
 */
var Level = function (theGame) {
    // Properties
    var mFloor,
        mSlopes,
        mItems,
        mObstacles,
        mLastAdded;

    // Constructor
    Phaser.Group.call(this, theGame);
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Level.prototype = Object.create(Phaser.Group.prototype);
Level.prototype.constructor = Level;

// Public methods

Level.prototype.init = function() {
    var aItem,
        i;

    mSlopes = this.game.add.group();
    mFloor = this.game.add.group();
    mObstacles = this.game.add.group();
    mItems = [];
    mLastAdded = {x: 0, y: this.game.world.centerY, width: 0, height: 0};

    this.initTerrain();
    this.initObstacles();

    // Add a few pieces of floor to start with
    for(i = 0; i < 4; i++) {
        this.addNewPieceOfFloor();
    }

    // Add the floor and the slopes to the level
    this.add(mSlopes);
    this.add(mFloor);
};

Level.prototype.initTerrain = function() {
    var aItem,
        i;

    // Create the platforms
    for(i = 0; i < 5; i++) {
        aItem = new Phaser.Sprite(this.game, this.game.world.width / 2 * i, this.game.world.centerY, 'platform');
        this.initPhysics(aItem);

        mFloor.add(aItem);
        mItems.push(aItem);

        aItem.kill();
    }

    // Create the slopes
    for(i = 0; i < 8; i++) {
        aItem = new Phaser.Sprite(this.game, 0, 0, i % 2 == 0 ? 'slope-up' : 'slope-down');
        this.initPhysics(aItem);
        mSlopes.add(aItem);
        mItems.push(aItem);
        aItem.kill();
    }
};

Level.prototype.initObstacles = function() {
    var aItem,
        i;

    for(i = 0; i < 5; i++) {
        aItem = new Phaser.Sprite(this.game, 0, 0, 'frog');
        aItem.animations.add('idle', [0, 1, 2, 3, 4], 5, true);
        aItem.play('idle');

        this.initPhysics(aItem);
        mObstacles.add(aItem);
        mItems.push(aItem);
        aItem.kill();
    }
};

Level.prototype.initPhysics = function(theItem) {
    this.game.physics.enable(theItem, Phaser.Physics.ARCADE);
    theItem.body.allowGravity = false;
    theItem.body.velocity.x = -100;
    theItem.body.immovable = true;
    theItem.checkWorldBounds = true;
};

Level.prototype.update = function() {
    var i,
        aTotal,
        aItem;

    Phaser.Group.prototype.update.call(this);

    // Let's check if anyone has moved out of the screen
    for(i = 0, aTotal = mItems.length; i < aTotal; i++) {
        aItem = mItems[i];

        if(aItem.alive && aItem.x <= -aItem.width) {
            if(aItem.key == 'platform' || aItem.key == 'slope-up' || aItem.key == 'slope-down') {
                this.addNewPieceOfFloor();
            }
            aItem.kill();
        }
    }

    // Is there a gap on the screen?
    if(mLastAdded && mLastAdded.x + mLastAdded.width < this.game.width) {
        this.addNewPieceOfFloor();
    }
};

Level.prototype.addNewPieceOfFloor = function() {
    var aNew;

    // Do we have any previously added element as
    // a reference to base on?
    if(mLastAdded != null) {
        // Yes.
        // Was the last added element a platform?
        if(mLastAdded.key == 'platform' && this.game.rnd.frac() <= 1.0) {
            // Yep! We can add a slope here then to make things more interesting.
            if(mLastAdded.y <= this.game.height * 0.3) {
                // We are too high right now, no room for up-slopes.
                // We must add a down-slope.
                aNew = this.getFirstDeadByType(mSlopes, 'slope-down');

            } else if(mLastAdded.y >= this.game.height * 0.8) {
                // We are too low. It's time for a up-slope.
                aNew = this.getFirstDeadByType(mSlopes, 'slope-up');

            } else {
                // We are not too high/low, so any slope will fit.
                aNew = mSlopes.getFirstDead();
            }

            aNew.reset(mLastAdded.x + mLastAdded.width - 30, mLastAdded.y - (aNew.key == 'slope-up' ? aNew.height / 2 - 5 : 0));

        } else {
            // Nop, it was not a platform. We must add a platform here then.
            aNew = this.getFirstDeadByType(mFloor, 'platform');
            aNew.reset(mLastAdded.x + mLastAdded.width - 50, mLastAdded.y);

            if(mLastAdded.key != 'platform') {
                aNew.y += mLastAdded.key == 'slope-up' ? 0 : mLastAdded.height / 2 - 5;
            }
        }
    } else {
        aNew = this.getFirstDeadByType(mFloor, 'platform');
        aNew.reset(this.game.width, this.game.world.centerY);
    }

    if(aNew) {
        // Make the platform move
        aNew.body.velocity.x = -100;
        // Tigh things together
        aNew.x -= 15;
        this.addNewObstacleIfAppropriate(aNew);
    }

    mLastAdded = aNew;
};

Level.prototype.addNewObstacleIfAppropriate = function(theWhere) {
    var aObstacle;

    if(theWhere.key == 'platform' && this.game.rnd.frac() <= 1.0) {
        aObstacle = mObstacles.getFirstDead();

        if(aObstacle) {
            aObstacle.reset(50 + this.game.rnd.frac() * theWhere.width * 0.8 + theWhere.x, theWhere.y - aObstacle.height + 5);
            aObstacle.body.velocity.x = theWhere.body.velocity.x;
        }
    }
};

Level.prototype.getFirstDeadByType = function(theGroup, theType) {
    var aRet;

    theGroup.forEachDead(function(theItem) {
        if(theItem.key == theType) {
            aRet = theItem;
        }
    });

    return aRet;
};

Level.prototype.getFloor = function() {
    return mFloor;
};

Level.prototype.getSlopes = function() {
    return mSlopes;
};

Level.prototype.getObstacles = function() {
    return mObstacles;
};
