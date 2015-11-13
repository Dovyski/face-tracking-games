/**
 * This class shows some visual information about how the
 * game should be played.
 */
var Tutorial = function () {
    // Properties
    var mNextStepCounter;
    var mNextStep;
    var mCurrentStep;
    var mGoodCard;
    var mBadCard;
    var mInfoGood;
    var mInfoBad;

    // Constructor
    Phaser.Group.call(this, Game);

    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Tutorial.prototype = Object.create(Phaser.Group.prototype);
Tutorial.prototype.constructor = Tutorial;

// Constants
Tutorial.STEP_DELAYING = 0;
Tutorial.STEP_INIT_EVERYTHING = 1;
Tutorial.STEP_DRAG_GOOD_CARD = 2;
Tutorial.STEP_INIT_DRAG_BAD_CARD = 3;
Tutorial.STEP_DRAG_BAD_CARD = 3;
Tutorial.STEP_EXPLAIN_TIME = 4;

// Public methods

Tutorial.prototype.init = function() {
    this.mInfoGood = new Phaser.Sprite(Game, 35, 85, 'tutorial-good');
    this.mInfoBad = new Phaser.Sprite(Game, 296, 120, 'tutorial-bad');

    this.mInfoGood.visible = false;
    this.mInfoBad.visible = false;

    this.add(this.mInfoGood);
    this.add(this.mInfoBad);
};


Tutorial.prototype.activate = function() {
    this.stepTo(Tutorial.STEP_INIT_EVERYTHING);
};

Tutorial.prototype.stepTo = function(theStep, theDelay) {
    if(theDelay > 0) {
        this.mNextStep = theStep;
        this.mNextStepCounter = theDelay;
        this.mCurrentStep = Tutorial.STEP_DELAYING;
    } else {
        this.mCurrentStep = theStep;
    }
};

Tutorial.prototype.getPlayState = function() {
    return Game.state.states[Game.state.current];
};

Tutorial.prototype.destroy = function() {
    // Restore highlighted elements back to normal
    this.highlightElements(null, Game.world.children);

    // Call super class original method.
    Phaser.Group.prototype.destroy.call(this);
};

Tutorial.prototype.update = function() {
    Phaser.Group.prototype.update.call(this);

    switch(this.mCurrentStep) {
        case Tutorial.STEP_DELAYING:
            // This states just spends time doing nothing.
            // It is meant to pace the tutorial between steps.
            if(this.mNextStepCounter > 0) {
                this.mNextStepCounter -= Game.time.elapsedMS;

                if(this.mNextStepCounter <= 0) {
                    this.mCurrentStep = this.mNextStep;
                }
            }
            break;

        case Tutorial.STEP_INIT_EVERYTHING:
            // No tutorial on the screen. Let's set
            // everything up for the show.
            this.flipTwoCardsForTutorialPurposes();
            this.highlightElements([mGoodCard, this.getPlayState().getMonster(), this.getPlayState().getHud().getQuestionDialog()], Game.world.children);

            this.mInfoGood.visible = true;
            this.mInfoGood.alpha = 1;

            // Move to next tutorial step after a while
            this.stepTo(Tutorial.STEP_DRAG_GOOD_CARD);
            break;

        case Tutorial.STEP_DRAG_GOOD_CARD:
            // The player is understanding how to drag cards.
            // As soon as the target card is dragged and dropped into
            // the monster, we move to the next step in the tutorial
            if(!mGoodCard.isFlipping() && mGoodCard.isFlippedDown()) {
                // The player got it! :D
                mGoodCard.alpha = 0.2;
                this.mInfoGood.visible = false;
                this.stepTo(Tutorial.STEP_INIT_DRAG_BAD_CARD, 1000);
            }
            break;

        case Tutorial.STEP_INIT_DRAG_BAD_CARD:
            // Let's teach about the bad cards now
            var aHighlight = [
                mBadCard,
                this.getPlayState().getTrash(),
                this.getPlayState().getHud().getQuestionDialog()
            ];
            this.highlightElements(aHighlight, Game.world.children);
            this.mInfoBad.visible = true;
            this.mInfoBad.alpha = 1;
            this.stepTo(Tutorial.STEP_DRAG_BAD_CARD);
            break;

        case Tutorial.STEP_DRAG_BAD_CARD:
            // Pretty much the same as in STEP_DRAG_GOOD_CARD,
            // but this time with the bad card.
            if(mBadCard.isFlippedDown()) {
                this.mInfoBad.visible = false;
                this.stepTo(Tutorial.STEP_EXPLAIN_TIME, 2000);
            }
            break;

        case Tutorial.STEP_EXPLAIN_TIME:
            // Teach about the time
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

    if(!aGroup) {
        return;
    }

    for(i = 0, aTotal = aGroup.length; i < aTotal; i++) {
        if(!(aGroup[i] instanceof Phaser.Sprite)) {
            this.highlightElements(theElements, aGroup[i].children);

        } else {
            if(theElements == null || theElements.indexOf(aGroup[i]) != -1 || (aGroup[i] instanceof RightWrongIcon)) {
                aGroup[i].alpha = 1;
            } else {
                aGroup[i].alpha = 0.15;
            }
        }
    }
};
