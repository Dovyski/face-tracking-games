/**
 * This class describes a card in the game
 */
Player = function (theX, theY) {
    // Properties

    // Constructor
    Phaser.Sprite.call(this, Game, theX, theY, 'card');
    this.init(theX, theY);
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// Public methods

Player.prototype.init = function(theX, theY) {
};
