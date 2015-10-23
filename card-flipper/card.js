/**
 * This class describes a card in the game
 */
Card = function (theGame, theX, theY) {
    // Properties
    this.mGame = theGame;
    this.mText = null;

    // Constructor
    Phaser.Sprite.call(this, theGame, theX, theY, 'card');
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Card.prototype = Object.create(Phaser.Sprite.prototype);
Card.prototype.constructor = Card;

// Public methods

Card.prototype.init = function() {
    this.mText = this.mGame.add.text(0, 0, '5', {font: "50px Arial", fill: "#ffffff", align: "center"});
    this.mText.visible = false;
    this.mText.anchor.set(0.5);
    this.mText.position.x = this.position.x;
    this.mText.position.y = this.position.y;

    // Centralize graphics
    this.anchor.set(0.5);

    //  Enables all kind of input actions on this image (click, etc)
	this.inputEnabled = true;
    this.events.onInputDown.add(this.onClick, this);
};

Card.prototype.isFlipped = function() {
    return this.frame != 0;
};

// Randomize the content of the card (number, color, etc)
Card.prototype.randomize = function() {
    this.mText.text = this.mGame.rnd.integerInRange(1, Constants.CARDS_MAX_NUMBER);
    this.frame = this.mGame.rnd.integerInRange(1, Constants.CARDS_MAX_COLORS);
};

Card.prototype.onClick = function() {
    if(this.isFlipped()) {
        this.frame = 0;
        this.mText.visible = 0;

    } else {
        this.randomize();
        this.mText.visible = true;
    }
};

Card.prototype.update = function() {
};
