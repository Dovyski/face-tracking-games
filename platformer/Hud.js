/**
 * This class describes the game hud.
 */
var Hud = function () {
    // Properties
    var mQuestionCard;

    // Constructor
    Phaser.Group.call(this, Game);
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;

// Public methods

Hud.prototype.init = function() {

};

Hud.prototype.getPlayState = function() {
    return Game.state.states[Game.state.current];
};
