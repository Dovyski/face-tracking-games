/**
 * This class describes a game level (scene).
 */
var Level = function (theGame) {
    // Properties
    var mFloor,
        mSlopes,
        mItems,
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
        aGame = this.game,
        i;

    mSlopes = this.game.add.group();
    mFloor = this.game.add.group();
    mItems = [];
    mLastAdded = null;

    // Create the platforms
    for(i = 0; i < 5; i++) {
        aItem = new Phaser.Sprite(this.game, this.game.world.width / 2 * i, this.game.world.centerY, 'platform');
        this.initPhysics(aItem);

        mFloor.add(aItem);
        mItems.push(aItem);

        if(i > 2) {
            aItem.kill();
        }
    }

    // Create the slopes
    for(i = 0; i < 8; i++) {
        aItem = new Phaser.Sprite(this.game, 0, 0, i % 2 == 0 ? 'slope-up' : 'slope-down');
        this.initPhysics(aItem);
        mSlopes.add(aItem);
        mItems.push(aItem);
        aItem.kill();
    }

    // Add the floor and the slopes to the level
    this.add(mSlopes);
    this.add(mFloor);
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
            aItem.kill();
            this.addNewPieceOfFloor();
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
            if(mLastAdded.y <= this.game.height * 0.2) {
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
        } else {
            // Nop, it was not a platform. We must add a platform here then.
            aNew = this.getFirstDeadByType(mFloor, 'platform');
        }
    } else {
        aNew = this.getFirstDeadByType(mFloor, 'platform');
    }

    if(aNew) {
        if(mLastAdded) {
            aNew.reset(mLastAdded.x + mLastAdded.width, mLastAdded.y);
        } else {
            aNew.reset(this.game.width, this.game.world.centerY);
        }

        // Make the platform move
        aNew.body.velocity.x = -100;

        // Tigh things together
        aNew.x -= 15;

        // Fix a small offset with slopes
        if(aNew.key != 'platform') {
            aNew.y += 5;
        }
    }
    mLastAdded = aNew;
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
