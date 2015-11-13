/**
 * This class shows some visual information about how the
 * game should be played.
 */
var Tutorial = function () {
    // Properties
    var mCurrentStep;
    var mBackground;
    var mMask;
    var mGoodCard;
    var mBadCard;
    var mGoodMessage;
    var mBadMessage;

    // Constructor
    Phaser.Group.call(this, Game);
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Tutorial.prototype = Object.create(Phaser.Group.prototype);
Tutorial.prototype.constructor = Tutorial;

// Constants
Tutorial.STEP_INIT_EVERYTHING = 0;
Tutorial.STEP_DRAG_GOOD_CARD = 1;
Tutorial.STEP_DRAG_BAD_CARD = 2;
Tutorial.EXPLAIN_TIME = 3;

// Public methods

Tutorial.prototype.activate = function() {
    this.mCurrentStep = Tutorial.STEP_INIT_EVERYTHING;
};

Tutorial.prototype.getPlayState = function() {
    return Game.state.states[Game.state.current];
};

Tutorial.prototype.update = function() {
    Phaser.Group.prototype.update.call(this);

    switch(this.mCurrentStep) {
        case Tutorial.STEP_INIT_EVERYTHING:
            this.flipTwoCardsForTutorialPurposes();
            this.highlightElements([mGoodCard, this.getPlayState().getMonster()], Game.world.children);

            this.mCurrentStep = Tutorial.STEP_DRAG_GOOD_CARD;
            break;
    }
};

Tutorial.prototype.flipTwoCardsForTutorialPurposes = function() {
	var aCard,
        aCards = Game.state.states[Game.state.current].getCards(),
		i,
        aLast,
        aCount = 0,
		aTotal = aCards.length;

	for(i = 0; i < aTotal; i++) {
		aCard = aCards.getChildAt(i);

		if(aCard) {
            aLast = aCard;

			if(aCount == 0) {
                mGoodCard = aCard;
                aCount++;
            }
		}
	}

    mBadCard = aLast;

    mGoodCard.flipUp();
    mBadCard.flipUp();
};

Tutorial.prototype.highlightElements = function(theElements, theGroup) {
    var i,
        aTotal,
        aGroup = theGroup;

    if(!aGroup || !(aGroup instanceof Array)) {
        return;
    }

    for(i = 0, aTotal = aGroup.length; i < aTotal; i++) {
        if(aGroup[i].children && aGroup[i].children.length > 0) {
            this.highlightElements(theElements, aGroup[i].children);

        } else {
            aGroup[i].alpha = theElements.indexOf(aGroup[i]) != -1 ? 1 : 0.2;
        }
    }
};

Tutorial.prototype.makeDarkBackground = function() {
    var aBmp;

    aBmp = new Phaser.BitmapData(Game, 'tutorial-background', Game.world.width, Game.world.height);
    aBmp.fill(0, 0, 0, 0.5);
    mBackground  = new Phaser.Sprite(Game, 0, 0, aBmp);

    this.add(mBackground);
};
