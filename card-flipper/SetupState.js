/**
 * Setups everything required for the face tracking thing to work.
 */

// Make the expression detector a global
// variable, so it can be used anywhere in the game.
var ExpressionDetector;

// Make the data collector a global variable, so it
// can be used anywhere in the game.
var Collector;

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

		// Init the data collector.
		Collector = new FTG.Collector();
	};

	this.update = function() {
		// Check if facial detections is working
		if(ExpressionDetector.getEmotions().length > 0) {
			// Yes, it is. Time to start the game.
			Game.state.start('play');
		}
	};
};
