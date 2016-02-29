/**
 * This class describes a card in the game
 */
Card = function (theX, theY) {
    // Properties
    var mIsFlipping = false;
    var mIsFlippingPastHalfWay = false;
    var mInitialPosition;
    var mBeingDragged = false;
    var mNextType;

    // Constructor
    Phaser.Sprite.call(this, Game, theX, theY, 'card');
    this.init(theX, theY);
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Card.prototype = Object.create(Phaser.Sprite.prototype);
Card.prototype.constructor = Card;

// Public methods

Card.prototype.init = function(theX, theY) {
    this.mInitialPosition = new Phaser.Point(theX, theY);
    this.mNextType = -1;

    // Centralize graphics
    this.anchor.set(0.5);

    //  Enables all kind of input actions on this image (click, etc)
	this.inputEnabled = true;
    this.events.onDragStart.add(this.onDragStart, this);
    this.events.onDragStop.add(this.onDragStop, this);
};

Card.prototype.disableInteractions = function() {
    this.inputEnabled = false;
    this.events.onDragStart.remove(this.onDragStart, this);
    this.events.onDragStop.remove(this.onDragStop, this);
};

Card.prototype.isFlippedUp = function() {
    return this.frame != 0;
};

Card.prototype.isFlippedDown = function() {
    return !this.isFlippedUp();
};

Card.prototype.isFlipping = function() {
    return this.mIsFlipping;
};

// Randomize the content of the card (number, color, etc)
Card.prototype.randomize = function() {
    this.frame = this.mNextType > 0 ? this.mNextType : Game.rnd.integerInRange(1, Constants.CARDS_COLORS - 1);
    this.mNextType = -1;
};

Card.prototype.flip = function(theFrame) {
    if(this.isFlippedUp()) {
        this.flipDown();

    } else {
        this.flipUp(theFrame);
    }
};

Card.prototype.flipUp = function(theFrame) {
    this.mIsFlipping = true;
    this.mNextType = theFrame || -1;
};

Card.prototype.flipDown = function(theForce) {
    if(!theForce) {
        this.mIsFlipping = true;
    } else {
        this.resetToInitialState();
    }
};

// Check if the card content answers the current question
Card.prototype.answersQuestion = function(theQuestion) {
    return this.frame != theQuestion;
};

Card.prototype.reactToClick = function(theWasCorrectAnswer) {
    var aState      = Game.state.states[Game.state.current],
        aHud        = aState.getHud(),
        aWasOk;

    aWasOk = (this.amICollidingWithMonster() && theWasCorrectAnswer) || (!theWasCorrectAnswer && this.amICollidingWithTrash());

    aState.countMove(aWasOk ? 'right' : 'wrong');
    aHud.showRightWrongSign(this, aWasOk);
};

Card.prototype.onDragStart = function() {
    this.mBeingDragged = true;
};

Card.prototype.amICollidingWithMonster = function() {
    var aMonster = Game.state.states[Game.state.current].getMonster();
    return aMonster.position.distance(this.position) <= Constants.CARDS_DIST_TARGET;
};

Card.prototype.amICollidingWithTrash = function() {
    var aTrash = Game.state.states[Game.state.current].getTrash();
    return aTrash.position.distance(this.position) <= Constants.CARDS_DIST_TARGET;
};

Card.prototype.amICollidingWithMonsterOrTrash = function() {
    return this.amICollidingWithMonster() || this.amICollidingWithTrash();
};

Card.prototype.moveToInitialPosition = function() {
    Game.add.tween(this).to({x: this.mInitialPosition.x, y: this.mInitialPosition.y}, 500, Phaser.Easing.Cubic.Out, true);
};

Card.prototype.onDragStop = function() {
    var aState      = Game.state.states[Game.state.current],
        aQuestion   = aState.getQuestion(),
        aHud        = aState.getHud(),
        aIsCorrect;

    // Inform dragging has stopped.
    this.mBeingDragged = false;

    // Check for the right answer only if the Card
    // was dropped into the monster or the trash
    if(this.amICollidingWithMonsterOrTrash()) {
        aIsCorrect = this.answersQuestion(aQuestion);

        this.reactToClick(aIsCorrect);
        this.resetToInitialState();
    } else {
        // Card was dropped in a weird place.
        // Return it to is initial position
        this.moveToInitialPosition();
    }
};

Card.prototype.resetToInitialState = function() {
    this.frame = 0;
    this.input.disableDrag();
    this.x = this.mInitialPosition.x;
    this.y = this.mInitialPosition.y;
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
                this.resetToInitialState();

            } else {
                this.randomize();
                this.input.enableDrag(true, true);
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
};
