/**
 * This class describes a particle of dust
 */
Dust = function (theGame, theX, theY) {
    Phaser.Particle.call(this, theGame, theX, theY, 'dust');
    this.animations.add('idle', [0, 1, 2, 3, 4], 10, false);
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Dust.prototype = Object.create(Phaser.Sprite.prototype);
Dust.prototype.constructor = Dust;

Dust.prototype.onEmit = function() {
    this.animations.play('idle');
};
