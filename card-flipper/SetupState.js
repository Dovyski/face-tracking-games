/**
 * Setups everything required for the face tracking thing to work.
 */

// Define some global information that should persist
// throughout the application.
var GlobalInfo = {
	expression: null,	// instance of the expression detector
	data: null,			// instance of the data collector
	uuid: null,			// a random id used for anonymous data collection
	game: 0,			// the game id
	score: null			// score during the game
};

var SetupState = function(theGame) {
};


SetupState.prototype = {
	mContinueBtn: null,
	mContinueLabel: null,
	mText: null,
	mReady: false,

	create: function() {
		this.stage.backgroundColor = 0xFFCC99;

		this.mText = this.add.text(this.world.centerX, this.world.centerY - 70, 'ATENTION!\n\nThis game is part of a research project. It uses your camera to anonymously track facial expressions while you play. At the end, the data is sent to a database.\n\n ***NO PICTURES OR VIDEOS ARE COLLECTED!***\n\nWe collect just the position of facial features, e.g. lips, and your score. All data is completely anonymous. \n\nBy clicking the "Continue" button below you agree to take part in this study. Thank you!', {fontSize: 18, fill: '#000', align: 'center'});
		this.mText.wordWrap = true;
	    this.mText.wordWrapWidth = this.world.width * 0.90;
	    this.mText.anchor.setTo(0.5);

		this.mContinueBtn = this.add.button(this.world.centerX - 85, this.world.height * 0.85, 'blue-button', this.initialize, this, 0, 1, 2);
		this.mContinueLabel = this.add.text(this.mContinueBtn.x + 40, this.mContinueBtn.y + 7, 'Continue', {fill: '#000', fontSize: 24});
	},

	initialize: function() {
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

		this.mReady = true;
	},

	update: function() {
		if(!this.mReady) {
			return;
		}

		// Check if facial detection is working
		if(this.mReady && GlobalInfo.expression.getEmotions().length > 0) {
			// Yes, it is. Time to start the game.
			this.state.start('menu');
		}
	}
};
