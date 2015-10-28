/**
 * Setups everything required for the face tracking thing to work.
 */

// Define some global information that should persist
// throughout the application.
var GlobalInfo = {
	expression: null,	// instance of the expression detector
	data: null,			// instance of the data collector
	uuid: null,			// a random id used for anonymous data collection
	score: null			// score during the game
};

var SetupState = function() {
	var mContinueBtn = null,
		mContinueLabel = null,
		mText = null,
		mReady = false;

	this.create = function() {
		mText = Game.add.text(Game.world.centerX, Game.world.centerY - 80, 'ATENTION!\n\nThis game is part of a research project. It uses your camera to anonymously track facial expressions while you play. At the end, the data is sent to a database.\n\n ***NO PICTURES OR VIDEOS ARE COLLECTED!***\n\nWe collect just a description of your emotions (eg. "sad", "happy") and your score. All data is completely anonymous. \n\nBy clicking the "Continue" button below you agree to take part in this experiment. Thank you!', {fontSize: 20, fill: '#000', align: 'center'});
		mText.wordWrap = true;
	    mText.wordWrapWidth = Game.world.width * 0.70;
	    mText.anchor.setTo(0.5);

		mContinueBtn  = Game.add.button(Game.world.centerX - 85, Game.world.height * 0.85, 'blue-button', init, this, 0, 1, 2);
		mContinueLabel = Game.add.text(mContinueBtn.x + 40, mContinueBtn.y + 7, 'Continue', {fill: '#000', fontSize: 24});
	};

	var init = function() {
		var aConfig = {
			container: 'container',
			videoId: 'videoel',
			overlay: 'overlay'
		};

		// Init all global stuff
		GlobalInfo.expression = new FTG.ExpressionDetector(aConfig);
		GlobalInfo.data = new FTG.Collector();

		// Make the facial detector run in a loop.
		GlobalInfo.expression.start();

		mReady = true;
	};

	this.update = function() {
		if(!mReady) {
			return;
		}

		// Check if facial detection is working
		if(mReady && GlobalInfo.expression.getEmotions().length > 0) {
			// Yes, it is. Time to start the game.
			Game.state.start('menu');
		}
	};
};
