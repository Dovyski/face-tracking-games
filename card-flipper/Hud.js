/**
 * This class describes the game hud.
 */
var Hud = function () {
    // Properties
    var mQuestionCard;
    var mRightWrongSignal;	// X showed when user clicks a wrong card
    var mRightWrongTimer;	// X showed when user clicks a wrong card
    var mMatchTime;	        // Displays the match's remaining time.
    var mTextRight;
    var mTextWrong;
    var mDialogQuestion;
    var mDialogTime;
    var mDialogRight;
    var mDialogWrong;
    var mLabelLookFor;
    var mLabelTime;
    var mLabelRight;
    var mLabelWrong;
    var mLabelLookForInfo;

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
    mQuestionCard       = new Card(mDialogQuestion.x + 130, mDialogQuestion.y + mDialogQuestion.height - 100);

    mTextRight          = new Phaser.Text(Game, mDialogRight.x + 23, mDialogRight.y + 20, '0', {fontSize: 70, fill: '#000', align: 'center'});
    mTextWrong          = new Phaser.Text(Game, mDialogWrong.x + 23, mDialogWrong.y + 20, '0', {fontSize: 70, fill: '#000', align: 'center'});

    mLabelLookFor       = new Phaser.Text(Game, mDialogQuestion.x + 10, mDialogQuestion.y + 5, 'Look for', {fontSize: 16, fill: '#fff', align: 'center'});
    mLabelLookForInfo   = new Phaser.Text(Game, mDialogQuestion.x + 25, mDialogQuestion.y + 55, 'Find cards that look like this:', {fontSize: 28, fill: '#000', align: 'center'});
    mLabelTime          = new Phaser.Text(Game, mDialogTime.x + 10, mDialogTime.y + 5, 'Time', {fontSize: 16, fill: '#fff', align: 'center'});
    mLabelRight         = new Phaser.Text(Game, mDialogRight.x + 10, mDialogRight.y + 5, 'Right', {fontSize: 16, fill: '#fff', align: 'center'});
    mLabelWrong         = new Phaser.Text(Game, mDialogWrong.x + 10, mDialogWrong.y + 5, 'Wrong', {fontSize: 16, fill: '#fff', align: 'center'});

    mRightWrongSignal.visible = false;
    mRightWrongSignal.anchor.set(0.5);

    mLabelLookForInfo.wordWrap = true;
    mLabelLookForInfo.wordWrapWidth = mDialogQuestion.width * 0.85;

    mQuestionCard.disableInteractions(); // prevent hud card to be clicked
    mQuestionCard.getText().visible = true; // make card text always visible
    mQuestionCard.getText().setStyle({fontSize: 28});

    this.add(mDialogQuestion);
    this.add(mDialogTime);
    this.add(mDialogRight);
    this.add(mDialogWrong);

    this.add(mTextRight);
    this.add(mTextWrong);
    this.add(mLabelLookFor);
    this.add(mLabelLookForInfo);
    this.add(mLabelTime);
    this.add(mLabelRight);
    this.add(mLabelWrong);

    this.add(mQuestionCard);
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
        aQuestion   = aState.getQuestion(),
        aScore      = aState.getScore();

    // Refresh current question
    mQuestionCard.getText().text = (aQuestion.odd ? 'Odd' : 'Even');
    mQuestionCard.frame = aQuestion.color;

    mTextRight.text = (aScore.right < 10 ? '0' : '') + aScore.right;
    mTextWrong.text = (aScore.wrong < 10 ? '0' : '') + aScore.wrong;
};

Hud.prototype.update = function() {
    var aState = Game.state.states[Game.state.current];

    // Check if the right/wrong sign is visible.
    // If it is, make it invisible after a while.
    if(mRightWrongSignal.visible) {
        mRightWrongTimer -= Game.time.elapsedMS;

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
