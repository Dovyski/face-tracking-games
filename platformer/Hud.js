/**
 * This class describes the game hud.
 */
var Hud = function () {
    // Properties
    var mHealthBar;
    var mHealthIcon;

    // Constructor
    Phaser.Group.call(this, Game);
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;

// Public methods

Hud.prototype.init = function() {
    mHealthBar  = new ProgressBar(this.game.width * 0.75, this.game.height - 80, 210, 20, {line: 0xAA3030, fill: 0xC83E3E});
    mHealthIcon = new Phaser.Sprite(this.game, -30, -8, 'heart');
    mHealthBar.addChild(mHealthIcon);

    this.add(mHealthBar);
};

Hud.prototype.refresh = function() {
    mHealthBar.setPercentage(this.getPlayState().getPlayer().getHealthPercentage());
};

Hud.prototype.getPlayState = function() {
    return Game.state.states[Game.state.current];
};
