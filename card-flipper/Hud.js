/**
 * This class describes the game hud.
 */
var Hud = function () {
    // Properties
    var mQuestionCard;
    var mRightWrongIcons;
    var mSkullIcon;
    var mHealthBar;
    var mHealthIcon;
    var mTurnTimeBar;
    var mTurnTimeBackground;
    var mDialogQuestion;
    var mLabelLookFor;
    var mLabelTrash;
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
    mRightWrongIcons   = new Phaser.Group(Game);

    for(var i = 0; i < Constants.CARDS_MAX_FLIPS_TURN; i++) {
        mRightWrongIcons.add(new RightWrongIcon());
    }

    mDialogQuestion     = new Phaser.Sprite(Game, Game.world.width * 0.72, 50, 'question-dialog');
    mQuestionCard       = new Card(mDialogQuestion.x + 165, mDialogQuestion.y + 87);
    mSkullIcon          = new Phaser.Sprite(Game, mDialogQuestion.x + 35, mDialogQuestion.y + 60, 'skull');

    mHealthBar          = new ProgressBar(this.getPlayState().getMonster().x - 95, this.getPlayState().getMonster().y + 110, 210, 20, {line: 0xAA3030, fill: 0xC83E3E});
    mHealthIcon         = new Phaser.Sprite(Game, mHealthBar.x - 30, mHealthBar.y - 8, 'heart');
    mTurnTimeBackground = new Phaser.Sprite(Game, Game.world.width * 0.05, Game.world.height * 0.05, 'clock-bar');
    mTurnTimeBar        = new ProgressBar(mTurnTimeBackground.x + 50, mTurnTimeBackground.y + 15, 550, 20, {line: 0xE86A17, fill: 0xEC8745});

    mLabelLookFor       = new Phaser.Text(Game, mDialogQuestion.x + 10, mDialogQuestion.y + 5, 'Poisonous', {fontSize: 16, fill: '#fff', align: 'center'});
    mLabelTrash         = new Phaser.Text(Game, this.getPlayState().getTrash().x - 40, this.getPlayState().getTrash().y + 70, 'Trash', {fontSize: 26, fill: '#000', align: 'center'});

    mQuestionCard.disableInteractions(); // prevent hud card to be clicked

    this.add(mDialogQuestion);
    this.add(mTurnTimeBackground);

    this.add(mLabelLookFor);
    this.add(mHealthBar);
    this.add(mHealthIcon);
    this.add(mTurnTimeBar);
    this.add(mLabelTrash);
    this.add(mSkullIcon);

    this.add(mQuestionCard);
    this.add(mRightWrongIcons);

    mSfxWrong = Game.add.audio('sfx-wrong');
    mSfxRight = Game.add.audio('sfx-right');
};

Hud.prototype.makeMonsterLookSickForAWhile = function() {
    this.getPlayState().getMonster().animations.play('sick');

    Game.time.events.add(Phaser.Timer.SECOND * 1, function() {
        this.getPlayState().getMonster().animations.play('idle');
    }, this);
};

Hud.prototype.showRightWrongSign = function(theCard, theWasItRight) {
    var aIcon = mRightWrongIcons.getFirstDead();

    if(aIcon) {
        aIcon.show(theCard.x, theCard.y, theWasItRight);
    }

    if(theWasItRight) {
        mSfxRight.play();
    } else {
        mSfxWrong.play();
        this.makeMonsterLookSickForAWhile();
    }
};

Hud.prototype.getPlayState = function() {
    return Game.state.states[Game.state.current];
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
