/**
 * This class describes a game level (scene).
 */
var Level = function (theGame) {
    // Properties
    var mFloor,
        mSlopesDown,
        mSlopesUp,
        mPlatforms,
        mObstacles;

    // Constructor
    Phaser.Group.call(this, theGame);
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Level.prototype = Object.create(Phaser.Group.prototype);
Level.prototype.constructor = Level;

// Public methods

Level.prototype.init = function() {
    var aPlatform,
        aGame = this.game;

    mFloor = this.game.add.group();

    mPlatforms = this.game.add.group();
    mPlatforms.add(new Phaser.Sprite(this.game, 0, this.game.world.centerY, 'platform'));
    mPlatforms.add(new Phaser.Sprite(this.game, this.game.world.centerX, this.game.world.centerY, 'platform'));

    mPlatforms.forEach(function(theItem) {
        aGame.physics.enable(theItem, Phaser.Physics.ARCADE);
        theItem.body.allowGravity = false;
        theItem.body.immovable = true;
    });

    this.add(mPlatforms);
};

Level.prototype.getFloor = function() {
    return mPlatforms;
};
