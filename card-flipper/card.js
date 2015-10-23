/**
 * This class describes a card in the game
 */
Card = function (theGame, theX, theY) {
    Phaser.Sprite.call(this, theGame, theX, theY, 'card-blue');

    this.anchor.set(0.5);

    //  Enables all kind of input actions on this image (click, etc)
	this.inputEnabled = true;
    this.events.onInputDown.add(this.onClick, this);
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Card.prototype = Object.create(Phaser.Sprite.prototype);
Card.prototype.constructor = Card;

// Public methods

Card.prototype.onClick = function() {
    this.angle = 45;
};

Card.prototype.update = function() {
};
