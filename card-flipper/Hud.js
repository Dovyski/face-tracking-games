/**
 * This class describes the game hud.
 */
var Hud = function () {
    // Properties
    var mQuestionCard;
    var mRightWrongSignal;	// X showed when user clicks a wrong card
    var mRightWrongTimer;	// X showed when user clicks a wrong card
    var mHealthBar;
    var mTurnTimeBar;
    var mTurnTimeBackground;
    var mDialogQuestion;
    var mDialogTime;
    var mLabelLookFor;
    var mLabelHealth;
    var mSfxWrong;
    var mSfxRight;

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
    mRightWrongTimer    = 0;

    mDialogQuestion     = new Phaser.Sprite(Game, Game.world.width * 0.72, 50, 'question-dialog');
    mDialogTime         = new Phaser.Sprite(Game, mDialogQuestion.x, Game.world.height * 0.8, 'time-dialog');
    mQuestionCard       = new Card(mDialogQuestion.x + 130, mDialogQuestion.y + 87);

    mHealthBar          = new ProgressBar(mDialogTime.x + 20, mDialogTime.y + 50, 210, 30, {line: 0x47B350, fill: 0x37DB45});
    mTurnTimeBackground = new Phaser.Sprite(Game, Game.world.width * 0.05, Game.world.height * 0.05, 'clock-bar');
    mTurnTimeBar        = new ProgressBar(mTurnTimeBackground.x + 50, mTurnTimeBackground.y + 15, 550, 20, {line: 0xE86A17, fill: 0xEC8745});

    mLabelLookFor       = new Phaser.Text(Game, mDialogQuestion.x + 10, mDialogQuestion.y + 5, 'Poisonous', {fontSize: 16, fill: '#fff', align: 'center'});
    mLabelHealth        = new Phaser.Text(Game, mDialogTime.x + 10, mDialogTime.y + 5, 'Health', {fontSize: 16, fill: '#fff', align: 'center'});

    mRightWrongSignal.visible = false;
    mRightWrongSignal.anchor.set(0.5);

    mQuestionCard.disableInteractions(); // prevent hud card to be clicked

    this.add(mDialogQuestion);
    this.add(mDialogTime);
    this.add(mTurnTimeBackground);

    this.add(mLabelLookFor);
    this.add(mLabelHealth);
    this.add(mHealthBar);
    this.add(mTurnTimeBar);

    this.add(mQuestionCard);
    this.add(mRightWrongSignal);

    mSfxWrong = Game.add.audio('sfx-wrong');
    mSfxRight = Game.add.audio('sfx-right');
};

Hud.prototype.showRightWrongSign = function(theCard, theWasItRight) {
    mRightWrongSignal.frame = theWasItRight ? 1 : 0;
    mRightWrongSignal.position.x = theCard.position.x;
    mRightWrongSignal.position.y = theCard.position.y;
    mRightWrongSignal.visible = true;

    mRightWrongTimer = Constants.HUD_RIGHT_WRONG_TTL;

    if(theWasItRight) {
        mSfxRight.play();
    } else {
        mSfxWrong.play();
    }
};

Hud.prototype.refresh = function() {
    var aState      = Game.state.states[Game.state.current],
        aQuestion   = aState.getQuestion(),
        aScore      = aState.getScore();

    // Refresh current question
    mQuestionCard.frame = aQuestion;

    mHealthBar.setPercentage(aState.getHealthPercentage());
};

Hud.prototype.highlightNewQuestion = function() {
    this.shake(mQuestionCard);
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

    // Update time remaining for the current turn
    mTurnTimeBar.setPercentage(aState.getPercentageTimeRemainingAnswerQuestion());
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

// Shake effect. From: http://phaser.io/examples/v2/tweens/earthquake
Hud.prototype.shake = function(theCard) {
    var aRumbleOffset = 10,
        aDuration = 100,
        aEase = Phaser.Easing.Bounce.InOut,
        aAutoStart = false,
        aDelay = 0,
        aYoyo = true,
        aProperties,
        aQuake;

    aProperties = {
        x: theCard.x - aRumbleOffset
    };

    aQuake = Game.add.tween(theCard).to(aProperties, aDuration, aEase, aAutoStart, aDelay, 4, aYoyo);
    aQuake.start();
};
