/**
 * This class describes the player's character.
 */
Player = function (theGame) {
    // Properties
    this.jumping;
    this.dashing,
    this.mActionTimer;

    // Constructor
    Phaser.Sprite.call(this, theGame, 50, theGame.width * 0.15, 'player');
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// Public methods

Player.prototype.init = function() {
    this.animations.add('run', [0, 1, 2, 3, 4, 5], 10, true);
    this.animations.add('jump', [6, 7, 8, 8, 9, 10], 5, true);

    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;

    this.jumping = false;
    this.dashing = false;
    this.mActionTimer = 0;

    this.animations.play('run');
};

Player.prototype.update = function() {
    this.body.velocity.x = 0;
    this.x = this.game.width * 0.15;

    if(this.jumping || this.dashing) {
        this.mActionTimer -= this.game.time.elapsedMS;

        if(this.mActionTimer <= 0) {
            this.jumping = false;
            this.dashing = false;
        }
    }
};

Player.prototype.jump = function() {
    if(!this.jumping) {
        this.jumping = true;
        this.animations.play('jump');
        this.body.velocity.y = -500;

        this.mActionTimer = 250;
    }
};

Player.prototype.dash = function() {
    if(!this.dashing) {
        this.dashing = true;
        this.animations.play('jump');

        this.mActionTimer = 500;
    }
};

Player.prototype.hurt = function() {
    console.log('Hurt!');
};
