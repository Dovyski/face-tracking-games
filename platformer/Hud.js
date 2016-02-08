/**
 * This class describes the game hud.
 */
var Hud = function () {
    // Properties
    var mHealthBar;
    var mHealthIcon;
    var mScoreLabel;
    var mScore;

    // Constructor
    Phaser.Group.call(this, Game);
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;

// Public methods

Hud.prototype.init = function() {
    mHealthBar  = new ProgressBar(this.game.width * 0.7, 25, 210, 20, {line: 0xAA3030, fill: 0xC83E3E});
    mHealthIcon = new Phaser.Sprite(this.game, -30, -8, 'heart');
    mHealthBar.addChild(mHealthIcon);

    mScoreLabel = new Phaser.Text(this.game, mHealthBar.x + 235, mHealthBar.y - 20, "score", { font: "Bold 18px Arial", fill: "#9E0000", align: "center" });
    mScore = new Phaser.Text(this.game, mScoreLabel.x - 10, mScoreLabel.y + 15, "0000", { font: "Bold 32px Arial", fill: "#D60000", align: "center" });

    this.add(mHealthBar);
    this.add(mScoreLabel);
    this.add(mScore);
};

Hud.prototype.refresh = function() {
    var aState,
        aScore;

    aState = this.getPlayState();
    mHealthBar.setPercentage(aState.getPlayer().getHealthPercentage());

    aScore = aState.getScore().right;
    mScore.text = '';
    mScore.text += aScore < 1000 ? '0' : '';
    mScore.text += aScore < 100 ? '0' : '';
    mScore.text += aScore < 10 ? '0' : '';

    mScore.text += aScore;
};

Hud.prototype.getPlayState = function() {
    return Game.state.states[Game.state.current];
};

Hud.prototype.getHeartIconPosition = function() {
    return {x: mHealthBar.x + mHealthIcon.x, y: mHealthBar.y + mHealthIcon.y};
};
