/**
 * This class describes the game hud.
 */
var Hud = function () {
    // Properties
    var mQuestionText;		// Text about the current question
    var mRightWrongSignal;	// X showed when user clicks a wrong card
    var mRightWrongTimer;	// X showed when user clicks a wrong card
    var mMatchTime;	        // Displays the match's remaining time.
    var mTextRight;
    var mTextWrong;
    var mDialogQuestion;
    var mDialogTime;
    var mDialogRight;
    var mDialogWrong;

    // Constructor
    Phaser.Group.call(this, Game);
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;

// Public methods

Hud.prototype.init = function() {
    mRightWrongSignal   = new Phaser.Sprite(Game, 0, 0, 'right-wrong');
    mMatchTime          = new Phaser.Text(Game, Game.world.width - 250, Game.world.height - 325, '0:00', {fontSize: 70, fill: '#000', align: 'center'});
    mRightWrongTimer    = 0;

    mDialogQuestion     = new Phaser.Sprite(Game, Game.world.width * 0.72, 50, 'question-dialog');
    mDialogTime         = new Phaser.Sprite(Game, mDialogQuestion.x, mDialogQuestion.height + mDialogQuestion.y + 30, 'time-dialog');
    mDialogRight        = new Phaser.Sprite(Game, mDialogQuestion.x, mDialogTime.height + mDialogTime.y + 30, 'quarter-dialog');
    mDialogWrong        = new Phaser.Sprite(Game, mDialogRight.x + mDialogRight.width + 8, mDialogRight.y, 'quarter-dialog');

    mQuestionText       = new Phaser.Text(Game, mDialogQuestion.x + 50, mDialogQuestion.y + 90, '');
    mTextRight          = new Phaser.Text(Game, mDialogRight.x + 40, mDialogRight.y + 20, '0', {fontSize: 70, fill: '#000', align: 'center'});
    mTextWrong          = new Phaser.Text(Game, mDialogWrong.x + 40, mDialogWrong.y + 20, '0', {fontSize: 70, fill: '#000', align: 'center'});

    mRightWrongSignal.visible = false;
    mRightWrongSignal.anchor.set(0.5);

    this.add(mDialogQuestion);
    this.add(mDialogTime);
    this.add(mDialogRight);
    this.add(mDialogWrong);
    this.add(mTextRight);
    this.add(mTextWrong);
    this.add(mQuestionText);
    this.add(mRightWrongSignal);
    this.add(mMatchTime);
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

    // Refresh current question
    mQuestionText.text = (aQuestion.odd ? 'Odd' : 'Even');

    mQuestionText.setStyle({
        fontSize: 64,
        fill: Constants.CARDS_COLORS[aQuestion.color].value
    });
};

Hud.prototype.update = function() {
    var aState = Game.state.states[Game.state.current];

    // Check if the right/wrong sign is visible.
    // If it is, make it invisible after a while.
    if(mRightWrongSignal.visible) {
        mRightWrongTimer -= Game.time.elapsed;

        if(mRightWrongTimer <= 0) {
            mRightWrongTimer = 0;
            mRightWrongSignal.visible = false;
        }
    }

    // Refresh match timer
    mMatchTime.text = this.formatTime(aState.getMatchRemainingTime());
};

Hud.prototype.formatTime = function(theMillisecondsTime) {
    var aFloat,
        aMinutes,
        aSeconds;

    aFloat    = theMillisecondsTime / 1000 / 60;
    aMinutes = aFloat | 0; // cast to int
    aSeconds = (aFloat - aMinutes) * 60;
    aSeconds = aSeconds | 0;

    return (theMillisecondsTime <= 0 ? '00:00' : (aMinutes < 10 ? '0' : '') + aMinutes + ':' + (aSeconds < 10 ? '0' : '') + aSeconds);
};
