/**
 * This class describes a card in the game
 */
Card = function (theX, theY) {
    // Properties
    this.mText = null;
    this.mFlipUpCounter = 0;

    // Constructor
    Phaser.Sprite.call(this, Game, theX, theY, 'card');
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Card.prototype = Object.create(Phaser.Sprite.prototype);
Card.prototype.constructor = Card;

// Public methods

Card.prototype.init = function() {
    this.mText = new Phaser.Text(Game, 0, 12, '5', {font: "bold 56px Arial", fill: "#000", align: "center"});
    this.mText.visible = false;
    this.mText.anchor.set(0.5);

    this.addChild(this.mText);

    // Centralize graphics
    this.anchor.set(0.5);

    //  Enables all kind of input actions on this image (click, etc)
	this.inputEnabled = true;
    this.events.onInputDown.add(this.onClick, this);
};

Card.prototype.disableInteractions = function() {
    this.inputEnabled = false;
    this.events.onInputDown.remove(this.onClick, this);
};

Card.prototype.isFlipped = function() {
    return this.frame != 0;
};

// Randomize the content of the card (number, color, etc)
Card.prototype.randomize = function() {
    var aRand = Game.rnd;

    this.mText.text     = aRand.integerInRange(1, Constants.CARDS_MAX_NUMBER);
    this.frame          = aRand.integerInRange(1, Constants.CARDS_COLORS.length - 1);
};

Card.prototype.flip = function() {
    if(this.isFlipped()) {
        this.flipDown();

    } else {
        this.flipUp();
    }
};

Card.prototype.flipUp = function() {
    this.randomize();

    this.mFlipUpCounter = Game.rnd.integerInRange(Constants.CARDS_MIN_FLIP_SHOW, Constants.CARDS_MAX_FLIP_SHOW);
    this.mText.visible = true;
};

Card.prototype.flipDown = function() {
    this.frame = 0;
    this.mText.visible = false;
};

// Check if the card content answers the current question
Card.prototype.answersQuestion = function(theQuestion) {
    var aOurNumberIsOdd = (parseInt(this.mText.text) % 2) != 0;
    return (this.frame == theQuestion.color) && ((theQuestion.odd && aOurNumberIsOdd) || (!theQuestion.odd && !aOurNumberIsOdd));
};

Card.prototype.onClick = function() {
    var aState      = Game.state.states[Game.state.current],
        aQuestion   = aState.getQuestion(),
        aHud        = aState.getHud();

    // Check for the right answer only if the Card
    // is flipped up
    if(this.isFlipped()) {
        if(this.answersQuestion(aQuestion)) {
            aHud.showRightWrongSign(this, true);
        } else {
            aHud.showRightWrongSign(this, false);
        }
    }
};

Card.prototype.update = function() {
    if(this.isFlipped()) {
        this.mFlipUpCounter -= Game.time.elapsedMS;

        if(this.mFlipUpCounter <= 0) {
            this.flipDown();
        }
    }
};

Card.prototype.getText = function() {
    return this.mText;
};
