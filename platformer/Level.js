/**
 * This class describes a game level (scene).
 */
var Level = function (theGame) {
    // Properties
    var mFloor,
        mObstacles,
        mCollectables,
        mCurrentPlayerFloor,
        mFlatCounter,
        mLandscape,
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
        i;

    mItems = [];
    mLandscape = new Landscape(this.game);
    mFloor = new Phaser.Group(this.game);
    mObstacles = new Phaser.Group(this.game);
    mCollectables = new Phaser.Group(this.game);
    mLastAdded = {x: 0, y: this.game.world.centerY, width: 0, height: 0};
    mCurrentPlayerFloor = mLastAdded;
    mFlatCounter = 0;

    this.initTerrain();
    this.initObstacles();
    this.initCollectables();

    // Add a few pieces of floor to start with
    for(i = 0; i < 3; i++) {
        this.addNewPieceOfFloor(this.getDifficulty(), true);
    }

    this.add(mLandscape.getBackground());
    this.add(mFloor);
    this.add(mObstacles);
    this.add(mCollectables);
};

Level.prototype.initTerrain = function() {
    var aItem,
        i;

    // Create the slopes
    for(i = 0; i < 8; i++) {
        aItem = new Phaser.Sprite(this.game, 0, 0, i % 2 == 0 ? 'slope-up' : 'slope-down');
        this.initPhysics(aItem);
        mFloor.add(aItem);
        mItems.push(aItem);
        aItem.kill();
    }

    // Create the platforms
    for(i = 0; i < 5; i++) {
        aItem = new Phaser.Sprite(this.game, this.game.world.width / 2 * i, this.game.world.centerY, 'platform');
        this.initPhysics(aItem);
        mFloor.add(aItem);
        mItems.push(aItem);
        aItem.kill();
    }
};

Level.prototype.initObstacles = function() {
    var aItem,
        i;

    for(i = 0; i < 15; i++) {
        aItem = new Phaser.Sprite(this.game, 0, 0, i % 2 == 0 ? 'obstacle-top' : 'obstacle-bottom');

        this.initPhysics(aItem);
        mObstacles.add(aItem);
        mItems.push(aItem);

        if(aItem.key == 'obstacle-bottom') {
            aItem.body.setSize(30, 50, 15, 20);
        } else {
            aItem.body.setSize(40, 40, 0, 0);
        }

        aItem.kill();
    }
};

Level.prototype.initCollectables = function() {
    var aItem,
        i;

    for(i = 0; i < 15; i++) {
        aItem = new Phaser.Sprite(this.game, 0, 0, 'heart');

        this.initPhysics(aItem);
        mCollectables.add(aItem);
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
        aItem,
        aDifficulty;

    Phaser.Group.prototype.update.call(this);

    // Get current difficulty configuration
    aDifficulty = this.getDifficulty();

    // Let's check which is the block touching the player
    // and if anything has moved out of the screen.
    for(i = 0, aTotal = mItems.length; i < aTotal; i++) {
        aItem = mItems[i];

        if(aItem.alive) {
            if(this.isFloor(aItem) && aItem.x > 0 && aItem.x <= this.game.width * Constants.PLAYER_POSITION_X) {
                mCurrentPlayerFloor = aItem.x > mCurrentPlayerFloor.x ? aItem : mCurrentPlayerFloor;
            }
            // Update item velocity according to game difficulty
            aItem.body.velocity.x = aDifficulty.speed;

            // Outside of screen?
            if(aItem.x <= -aItem.width) {
                aItem.kill();

                if(this.isFloor(aItem)) {
                    this.addNewPieceOfFloor(aDifficulty);

                } else if(this.isObstacle(aItem)) {
                    this.getPlayState().handleObstacleRemoval(aItem);
                }
            }
        }
    };

    // Is there a gap on the screen?
    if(mLastAdded && mLastAdded.x + mLastAdded.width < this.game.width) {
        this.addNewPieceOfFloor(aDifficulty);
    }
};

Level.prototype.isFloor = function(theItem) {
    return theItem.key == 'platform' || theItem.key == 'slope-up' || theItem.key == 'slope-down';
};

Level.prototype.isObstacle = function(theItem) {
    return theItem.key == 'obstacle-top' || theItem.key == 'obstacle-bottom';
};

Level.prototype.addNewPieceOfFloor = function(theDifficulty, theTerrainOnly) {
    var aNew;

    // Do we have any previously added element as
    // a reference to base on?
    if(mLastAdded != null) {
        // Yes.
        // Was the last added element a platform?
        if(mLastAdded.key == 'platform' && ++mFlatCounter >= theDifficulty.platforms_before_slope) {
            // Yep! We can add a slope here then to make things more interesting.
            if(mLastAdded.y <= this.game.height * theDifficulty.slope_max_hight) {
                // We are too high right now, no room for up-slopes.
                // We must add a down-slope.
                aNew = this.getFirstDeadByType(mFloor, 'slope-down');

            } else if(mLastAdded.y >= this.game.height * theDifficulty.slope_min_hight) {
                // We are too low. It's time for a up-slope.
                aNew = this.getFirstDeadByType(mFloor, 'slope-up');

            } else {
                // We are not too high/low, so any slope will fit.
                aNew = this.getFirstDeadByType(mFloor, this.game.rnd.frac() < 0.5 ? 'slope-up' : 'slope-down');
            }

            aNew.reset(mLastAdded.x + mLastAdded.width - 30, mLastAdded.y - (aNew.key == 'slope-up' ? aNew.height / 2 - 5 : 0));
            mFlatCounter = 0;

        } else {
            // Nop, it was not a platform. We must add a platform here then.
            aNew = this.getFirstDeadByType(mFloor, 'platform');
            aNew.reset(mLastAdded.x + mLastAdded.width - 10, mLastAdded.y);

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
        aNew.body.velocity.x = theDifficulty.speed;
        // Tigh things together
        aNew.x -= 15;

        if(!theTerrainOnly) {
            this.addNewObstacleIfAppropriate(aNew, theDifficulty);
            this.addNewCollectableIfAppropriate(aNew, theDifficulty);
        }
    }

    mLastAdded = aNew;
};

Level.prototype.addNewCollectableIfAppropriate = function(theWhere, theDifficulty) {
    var i,
        aItem;

    if(theWhere.key == 'platform' && this.game.rnd.frac() <= theDifficulty.collectable_chance) {
        for(i = 0; i < theDifficulty.collectables_per_platforms; i++) {
            aItem = mCollectables.getFirstDead();

            if(aItem) {
                aItem.reset(5 + theWhere.x + theDifficulty.collectable_spacing * i, theWhere.y - 50 - (this.game.rnd.frac() < 0.5 ? theDifficulty.collectable_max_height : theDifficulty.collectable_min_height));
                aItem.body.velocity.x = theDifficulty.speed;
            }
        }
    }
};

Level.prototype.addNewObstacleIfAppropriate = function(theWhere, theDifficulty) {
    var aObstacle,
        aPosX,
        aPosY,
        i;

    if(theWhere.key == 'platform' && this.game.rnd.frac() <= theDifficulty.obstacles_chance) {
        for(i = 0; i < theDifficulty.obstacles_per_platform; i++) {
            aObstacle = this.getFirstDeadByType(mObstacles, this.game.rnd.frac() < 0.5 ? 'obstacle-top' : 'obstacle-bottom');

            if(aObstacle) {
                aPosX = theDifficulty.obstacle_min_pos + theWhere.x + theDifficulty.obstacle_spacing * i;
                aPosY = theWhere.y + -aObstacle.height + 5;

                aObstacle.reset(aPosX, aPosY);
                aObstacle.body.velocity.x = theWhere.body.velocity.x;
                aObstacle.touched = false; // mark as not touched by the player

                if(aObstacle.key == 'obstacle-top') {
                    aObstacle.anchor.setTo(0.5);
                    aObstacle.body.angularVelocity = 100;
                    aObstacle.y -= 20;
                }
            }
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

Level.prototype.getCurrentPlayerFloor = function() {
    return mCurrentPlayerFloor;
};

Level.prototype.getFloor = function() {
    return mFloor;
};

Level.prototype.getSlopes = function() {
    return mFloor;
};

Level.prototype.getObstacles = function() {
    return mObstacles;
};

Level.prototype.getCollectables = function() {
    return mCollectables;
};

Level.prototype.getPlayState = function() {
    return this.game.state.states[Game.state.current];
};

Level.prototype.getDifficulty = function() {
    return this.getPlayState().getDifficulty();
};

Level.prototype.getBackground = function() {
    return mLandscape.getBackground();
};

Level.prototype.getForeground = function() {
    return mLandscape.getForeground();
};
