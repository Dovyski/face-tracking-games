/**
 * Setups everything required for the face tracking thing to work.
 */

// Make the expression detector a global
// variable, so it can be used anywhere in the game.
var ExpressionDetector;

var SetupState = function() {
	this.create = function() {
		var aConfig = {
			container: 'container',
			videoId: 'videoel',
			overlay: 'overlay'
		};

		ExpressionDetector = new FTG.ExpressionDetector(aConfig);

		// Make the detector run in a loop.
		ExpressionDetector.start();

		// TODO: start the game only when emotions are available
		Game.state.start('play');
	};
};
