/**
 * This class describes the game hud.
 */
var Hud = function () {
    // Properties
    var mQuestionText;		// Text about the current question
    var mRightWrongSignal;	// X showed when user clicks a wrong card
    var mRightWrongTimer;	// X showed when user clicks a wrong card

    // Constructor
    Phaser.Group.call(this, Game);
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;

// Public methods

Hud.prototype.init = function() {
    mQuestionText       = new Phaser.Text(Game, Game.world.width * 0.75, 20, '');
    mRightWrongSignal   = new Phaser.Sprite(Game, 0, 0, 'right-wrong');
    mRightWrongTimer    = 0;

    mRightWrongSignal.visible = false;
    mRightWrongSignal.anchor.set(0.5);

    this.add(mQuestionText);
    this.add(mRightWrongSignal);
}

Hud.prototype.showRightWrongSign = function(theCard, theWasItRight) {
    mRightWrongSignal.frame = theWasItRight ? 1 : 0;
    mRightWrongSignal.position.x = theCard.position.x;
    mRightWrongSignal.position.y = theCard.position.y;
    mRightWrongSignal.visible = true;

    mRightWrongTimer = Constants.HUD_RIGHT_WRONG_TTL;

    if(theWasItRight) {
        // TODO: play some SFX
    } else {

    }
};

Hud.prototype.refresh = function() {
    var aState      = Game.state.states[Game.state.current],
        aQuestion   = aState.getQuestion();

	mQuestionText.text = (aQuestion.odd ? 'Odd' : 'Even');

    mQuestionText.setStyle({
        fontSize: 64,
        fill: Constants.CARDS_COLORS[aQuestion.color].value
    });
};

Hud.prototype.update = function() {
    // Check if the right/wrong sign is visible.
    // If it is, make it invisible after a while.
    if(mRightWrongSignal.visible) {
        mRightWrongTimer -= Game.time.elapsed;

        if(mRightWrongTimer <= 0) {
            mRightWrongTimer = 0;
            mRightWrongSignal.visible = false;
        }
    }
};
