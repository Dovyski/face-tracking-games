/**
 * Setups everything required for the face tracking thing to work.
 */

// Define some global information that should persist
// throughout the application.
var GlobalInfo = {
	expression: null,	// instance of the expression detector
	data: null,			// instance of the data collector
	uuid: null			// a random id used for anonymous data collection
};

var SetupState = function() {
	this.create = function() {
		var aConfig = {
			container: 'container',
			videoId: 'videoel',
			overlay: 'overlay'
		};

		// Init all global stuff
		GlobalInfo.expression = new FTG.ExpressionDetector(aConfig);
		GlobalInfo.data = new FTG.Collector();
		GlobalInfo.uuid = Game.rnd.uuid();

		// Make the facial detector run in a loop.
		GlobalInfo.expression.start();
	};

	this.update = function() {
		// Check if facial detection is working
		if(GlobalInfo.expression.getEmotions().length > 0) {
			// Yes, it is. Time to start the game.
			Game.state.start('menu');
		}
	};
};
