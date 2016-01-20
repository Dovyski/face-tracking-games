/**
 * This class renders the clouds, water, etc
 */
Landscape = function (theGame) {
    // Properties
    this.mBackground;
    this.mForeground;
    this.mItems;

    // Constructor
    Phaser.Group.call(this, theGame);
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Landscape.prototype = Object.create(Phaser.Group.prototype);
Landscape.prototype.constructor = Landscape;

// Public methods

Landscape.prototype.init = function() {
    var i,
        aThing;

    this.mBackground = new Phaser.Group(this.game);
    this.mForeground = new Phaser.Group(this.game);
    this.mItems = [];

    for(i = 0; i < 2; i++) {
        aThing = new Phaser.Sprite(this.game, i * this.game.width, this.game.height - 58, 'water');
        this.initPhysics(aThing);
        this.mForeground.add(aThing);
        this.mItems.push(aThing);
    }

    for(i = 0; i < 15; i++) {
        aThing = new Phaser.Sprite(this.game, this.game.rnd.realInRange(0, this.game.world.width), this.game.rnd.realInRange(0, this.game.world.height - 100), 'clouds');
        this.initPhysics(aThing);
        aThing.frame = i % 2;
        this.mBackground.add(aThing);
        this.mItems.push(aThing);
    }
};

Landscape.prototype.initPhysics = function(theItem) {
    this.game.physics.enable(theItem, Phaser.Physics.ARCADE);
    theItem.body.allowGravity = false;
    theItem.body.velocity.x = -100;
    theItem.body.immovable = true;
};

Landscape.prototype.update = function() {
    var i,
        aDifficulty,
        aTotal,
        aItem;

    aDifficulty = Game.state.states[Game.state.current].getDifficulty();

    for(i = 0, aTotal = this.mItems.length; i < aTotal; i++) {
        aItem = this.mItems[i];
        aItem.body.velocity.x = aDifficulty.speed * (aItem.key == 'clouds' ? 0.2 : 1);

        if(aItem.x <= -aItem.width) {
            aItem.x = this.game.width - 5;
        }
    }
};

Landscape.prototype.getBackground = function() {
    return this.mBackground;
};

Landscape.prototype.getForeground = function() {
    return this.mForeground;
};
