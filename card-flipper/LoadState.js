/**
 * Loads all assets used by the game
 */

var LoadState = function() {
	this.create = function() {
		Game.state.start('setup');
	};

	this.preload = function() {
		// Assets made by myself
		Game.load.spritesheet('right-wrong', 'assets/right_wrong.png', 145, 207); // By Fernando Bevilacqua, public domain

		// Assets from external authors
		Game.load.spritesheet('card', 'assets/card.png', 100, 100); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.spritesheet('blue-button', 'assets/blue_button.png', 190, 49); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('dialog-small', 'assets/dialog_small.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('deck-background', 'assets/deck_background.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('quarter-dialog', 'assets/quarter_dialog.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('question-dialog', 'assets/question_dialog.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('time-dialog', 'assets/time_dialog.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl

		// Load all JS required to make the face tracking thing work.
		Game.load.script('camera.js', '../js/ftg.camera.js');
		Game.load.script('ftg.expression.js', '../js/ftg.expression.js');
		Game.load.script('ftg.collector.js', '../js/ftg.collector.js');
		Game.load.script('utils.js', '../js/3rdparty/clmtrackr/js/utils.js');
		Game.load.script('clmtrackr.js', '../js/3rdparty/clmtrackr/js/clmtrackr.js');
		Game.load.script('Stats.js', '../js/3rdparty/clmtrackr/js/Stats.js');
		Game.load.script('model_pca_20_svm_emotionDetection.js', '../js/3rdparty/clmtrackr/models/model_pca_20_svm_emotionDetection.js');
		Game.load.script('emotion_classifier.js', '../js/3rdparty/clmtrackr/examples/js/emotion_classifier.js');
		Game.load.script('emotionmodel.js', '../js/3rdparty/clmtrackr/examples/js/emotionmodel.js');
	};
};
