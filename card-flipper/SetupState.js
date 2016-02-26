/**
 * Setups everything required for the face tracking thing to work.
 */

// Define some global information that should persist
// throughout the application.
var GlobalInfo = {
	expression: null,	// instance of the expression detector
	data: null,			// instance of the data collector
	user: null,			// User id
	game: null,			// the game id
	score: null,		// score during the game
	experiment: null	// an instance to the experiment manager (if we are running as part of an experiment)
};

function getURLParamByName(theName) {
	var aRegex;

	theName = theName.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	aRegex = new RegExp('[\\?&]' + theName + '=([^&#]*)'),
	aResults = aRegex.exec(location.search);

	return aResults === null ? null : decodeURIComponent(aResults[1].replace(/\+/g, ' '));
}

// Get reference to experiment manager (if any)
var aExperiment = window.parent.FTG ? window.parent.FTG.Experiment : {};

// Get current user and game id from URL
GlobalInfo.user = getURLParamByName('user');
GlobalInfo.game = getURLParamByName('game');

// Are we running as part of an experiment?
if(aExperiment.instance) {
	// Yes, we are. In this case, we adjust
	// everything based on the external information
	// that were provived by the experiment manager.
	GlobalInfo.experiment = aExperiment.instance;
	console.log('Game is running in experiment mode (user: ' + GlobalInfo.user + ', game: ' + GlobalInfo.game + ')');
}

// Disable mouse right-click (prevent problems during the experiment)
document.addEventListener('contextmenu', function(theEvent) {
    theEvent.preventDefault();
	return false;
}, false);

var SetupState = function(theGame) {
};

SetupState.prototype = {
	mContinueBtn: null,
	mContinueLabel: null,
	mText: null,
	mReady: false,

	create: function() {
		this.stage.backgroundColor = 0xFFCC99;
		this.game.stage.disableVisibilityChange = true; // Prevent pause when browser window loses focus

		// Scale the game to fill the whole screen, keeping the aspect ratio.
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

		if(typeof Constants === 'object') {
			this.adjustConstantsFromConfig();
		}

		if(GlobalInfo.experiment || getURLParamByName('face') == 'false') {
			// We are in an experiment. No need to show information about data collection, it has
			// already been done.
			this.initialize();

		} else {
			this.mText = this.add.text(this.world.centerX, this.world.centerY - 70, 'ATENTION!\n\nThis game is part of a research project. It uses your camera to anonymously track facial expressions while you play. At the end, the data is sent to a database.\n\n ***NO PICTURES OR VIDEOS ARE COLLECTED!***\n\nWe collect just the position of facial features, e.g. lips, and your score. All data is completely anonymous. \n\nBy clicking the "Continue" button below you agree to take part in this study. Thank you!', {fontSize: 18, fill: '#000', align: 'center'});
			this.mText.wordWrap = true;
		    this.mText.wordWrapWidth = this.world.width * 0.90;
			this.mText.anchor.setTo(0.5);

			this.mContinueBtn = this.add.button(this.world.centerX - 85, this.world.height * 0.85, 'blue-button', this.initialize, this, 0, 1, 2);
			this.mContinueLabel = this.add.text(this.mContinueBtn.x + 40, this.mContinueBtn.y + 7, 'Continue', {fill: '#000', fontSize: 24});
		}
	},

	initialize: function() {
		var aConfig = {
			container: 'container',
			videoId: 'videoel',
			overlay: 'overlay'
		};

		// Enable facial tracking only if someone told us to.
		if(getURLParamByName('face') == 'true') {
			GlobalInfo.expression = new FTG.ExpressionDetector(aConfig);
		}

		GlobalInfo.data = new FTG.Collector(aConfig);

		if(GlobalInfo.expression) {
			// Make the facial detector run in a loop.
			GlobalInfo.expression.start();
			this.mReady = true;

		} else {
			// We are not using facial tracking, so there is no need
			// to wait here. Let's move along.
			this.state.start('menu');
		}
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
	},

	adjustConstantsFromConfig: function() {
		var aName,
			aConfig,
			aOld;

		for(aName in Constants) {
			aConfig = getURLParamByName(aName);

			if(aConfig != null) {
				aOld = Constants[aName];
				Constants[aName] = aConfig;
				console.log('Constants.' + aName + ' changed from "' + aOld + '" to "' + aConfig + '"');
			}
		}
	}
};
