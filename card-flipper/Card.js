/**
 * This class describes a card in the game
 */
Card = function (theX, theY) {
    // Properties
    var mText = null;
    var mFlipUpCounter = 0;
    var mIsFlipping = false;
    var mIsFlippingPastHalfWay = false;

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

Card.prototype.isFlippedUp = function() {
    return this.frame != 0;
};

// Randomize the content of the card (number, color, etc)
Card.prototype.randomize = function() {
    var aRand = Game.rnd;

    this.mText.text     = aRand.integerInRange(1, Constants.CARDS_MAX_NUMBER);
    this.frame          = aRand.integerInRange(1, Constants.CARDS_COLORS.length - 1);
};

Card.prototype.flip = function() {
    if(this.isFlippedUp()) {
        this.flipDown();

    } else {
        this.flipUp();
    }
};

Card.prototype.flipUp = function() {
    this.mIsFlipping = true;
};

Card.prototype.flipDown = function() {
    this.mIsFlipping = true;
};

// Check if the card content answers the current question
Card.prototype.answersQuestion = function(theQuestion) {
    var aOurNumberIsOdd = (parseInt(this.mText.text) % 2) != 0;
    return (this.frame != theQuestion.color) || ((theQuestion.odd && !aOurNumberIsOdd) || (!theQuestion.odd && aOurNumberIsOdd));
};

Card.prototype.reactToClick = function(theWasCorrectAnswer) {
    var aState      = Game.state.states[Game.state.current],
        aHud        = aState.getHud();

    aState.countMove(theWasCorrectAnswer ? 'right' : 'wrong');
    aHud.showRightWrongSign(this, theWasCorrectAnswer);
};

Card.prototype.onClick = function() {
    var aState      = Game.state.states[Game.state.current],
        aQuestion   = aState.getQuestion(),
        aHud        = aState.getHud(),
        aIsCorrect;

    // Check for the right answer only if the Card
    // is flipped up
    if(this.isFlippedUp()) {
        aIsCorrect = this.answersQuestion(aQuestion);

        this.reactToClick(aIsCorrect);
        this.flipDown();
    }
};

Card.prototype.updateFlippingProcess = function() {
    if(this.mIsFlipping) {
        this.scale.x -= 0.1;

        if(this.scale.x <= -0.3) {
            this.mIsFlipping = false;
            this.mIsFlippingPastHalfWay = true;
            this.scale.x = 0.5;

            // We arrive at the middle of the card turning process
            // It's time to adjust the back content so the animation
            // looks convincing.
            if(this.isFlippedUp()) {
                this.frame = 0;
                this.mText.visible = false;

            } else {
                this.randomize();
                this.mFlipUpCounter = Game.rnd.integerInRange(Constants.CARDS_MIN_FLIP_SHOW, Constants.CARDS_MAX_FLIP_SHOW);
                this.mText.visible = true;
            }
        }
    } else if(this.mIsFlippingPastHalfWay) {
        this.scale.x += 0.1;

        if(this.scale.x >= 0.95) {
            this.scale.x = 1;
            this.mIsFlippingPastHalfWay = false;
        }
    }
};

Card.prototype.update = function() {
    this.updateFlippingProcess();

    if(this.isFlippedUp()) {
        this.mFlipUpCounter -= Game.time.elapsedMS;

        if(this.mFlipUpCounter <= 0 && !this.mIsFlipping) {
            this.flipDown();
        }
    }
};

Card.prototype.getText = function() {
    return this.mText;
};
