/**
 * This class describes the icon displayed when something
 * right or wrong happens on the screen.
 */
RightWrongIcon = function () {
    // Constructor
    Phaser.Sprite.call(this, Game, 0, 0, 'right-wrong');

    this.kill();
    this.anchor.set(0.5);
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
RightWrongIcon.prototype = Object.create(Phaser.Sprite.prototype);
RightWrongIcon.prototype.constructor = RightWrongIcon;

// Public methods

RightWrongIcon.prototype.show = function(theX, theY, theWasItRight) {
    this.reset(theX, theY);
    this.frame = theWasItRight ? 1 : 0;

    Game.time.events.add(Constants.HUD_RIGHT_WRONG_TTL, this.kill, this);
};
