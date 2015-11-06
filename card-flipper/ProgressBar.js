/**
 * This class describes a progress bar.
 */
ProgressBar = function (theX, theY, theWidth, theHeight, theConfig) {
    // Properties
    this.mContainer = null;
    this.mFill = null;
    this.mWidth = theWidth;
    this.mHeight = theHeight;
    this.mConfig = theConfig || {line: 0xff0000, fill: 0xff0000};

    // Constructor
    Phaser.Sprite.call(this, Game, theX, theY, 'pixel');
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
ProgressBar.prototype = Object.create(Phaser.Sprite.prototype);
ProgressBar.prototype.constructor = ProgressBar;

// Public methods

ProgressBar.prototype.init = function() {
    this.mContainer = new Phaser.Graphics(Game);
    this.mFill = new Phaser.Graphics(Game);

    this.mContainer.lineStyle(2, this.mConfig.line, 1);
    this.mContainer.drawRect(0, 0, this.mWidth, this.mHeight);

    this.mFill.lineStyle(2, this.mConfig.fill, 1);
    this.mFill.beginFill(this.mConfig.fill, 0.5);
    this.mFill.drawRect(0, 0, this.mWidth, this.mHeight);
    this.mFill.endFill();

    this.addChild(this.mFill);
    this.addChild(this.mContainer);
};

ProgressBar.prototype.setPercentage = function(theValue) {
    theValue = theValue < 0 ? 0 : theValue;
    theValue = theValue > 1 ? 1 : theValue;

    this.mFill.scale.x = theValue;
};
