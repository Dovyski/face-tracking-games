/**
 * This class describes the game hud.
 */
var Hud = function () {
    // Properties
    var mQuestionText;		// Text about the current question

    // Constructor
    Phaser.Group.call(this, Game);
    this.init();
};

// Lovely pants-in-the-head javascript boilerplate for OOP.
Hud.prototype = Object.create(Phaser.Group.prototype);
Hud.prototype.constructor = Hud;

// Public methods

Hud.prototype.init = function() {
    mQuestionText = new Phaser.Text(Game, Game.world.width * 0.75, 20, '');

    this.add(mQuestionText);
}

Hud.prototype.refresh = function() {
    var aState      = Game.state.states[Game.state.current],
        aQuestion   = aState.getQuestion();

	mQuestionText.text = (aQuestion.odd ? 'Odd' : 'Even');

    mQuestionText.setStyle({
        fontSize: 64,
        fill: Constants.CARDS_COLORS[aQuestion.color].value
    });
};
