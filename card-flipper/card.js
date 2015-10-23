/**
 * This class describes a card in the game
 */
Card = function (theGame, theX, theY) {
    // Properties
    this.mGame = theGame;

    // Constructor
    Phaser.Sprite.call(this, theGame, theX, theY, 'card');
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Card.prototype = Object.create(Phaser.Sprite.prototype);
Card.prototype.constructor = Card;

// Public methods

Card.prototype.init = function() {
    // Setup animations


    // Setup the front
    this.anchor.set(0.5);

    //  Enables all kind of input actions on this image (click, etc)
	this.inputEnabled = true;
    this.events.onInputDown.add(this.onClick, this);
};

Card.prototype.isFlipped = function() {
    return this.frame != 0;
};

Card.prototype.onClick = function() {
    if(this.isFlipped()) {
        this.frame = 0;

    } else {
        this.frame = 1;
    }
};

Card.prototype.update = function() {
};
