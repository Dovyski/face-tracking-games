/**
 * This class describes a game level (scene).
 */
var Level = function (theGame) {
    // Properties
    var mFloor,
        mSlopesDown,
        mSlopesUp,
        mSlopes,
        mPlatforms,
        mObstacles,
        mLastShifted;

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

    mFloor = this.game.add.group();
    mSlopes = this.game.add.group();
    mSlopesUp = this.game.add.group();
    mSlopesDown = this.game.add.group();
    mPlatforms = this.game.add.group();
    mLastShifted = null;

    // Create the platforms
    for(i = 0; i < 3; i++) {
        aItem = new Phaser.Sprite(this.game, this.game.world.width / 2 * i, this.game.world.centerY, 'platform');
        this.initPhysics(aItem);

        mPlatforms.add(aItem);
        mFloor.add(aItem);
    }

    // Create the slopes
    // TODO: work this
    aItem = new Phaser.Sprite(this.game, 0, this.game.world.centerY - 80, 'slope-up');
    this.initPhysics(aItem);
    mSlopesUp.add(aItem);

    // Add the floor to the level
    this.add(mFloor);
};

Level.prototype.initPhysics = function(theItem) {
    this.game.physics.enable(theItem, Phaser.Physics.ARCADE);
    theItem.body.allowGravity = false;
    theItem.body.velocity.x = -100;
    theItem.body.immovable = true;
    theItem.checkWorldBounds = true;

    theItem.events.onOutOfBounds.add(this.onOutOfBound, this);
};

Level.prototype.onOutOfBound = function(theItem) {
    if(mLastShifted != null) {
        theItem.x = mLastShifted.x + mLastShifted.width;

    } else {
        theItem.x = this.game.world.width;
    }

    mLastShifted = theItem;
};

Level.prototype.getFloor = function() {
    return mFloor;
};

Level.prototype.getSlopes = function() {
    return mSlopes;
};
