/**
 * Loads all assets used by the game
 */

var LoadState = function() {
	var mLoadingBackground,
		mLoadingBar;

	this.create = function() {
		Game.state.start('setup');
	};

	this.preload = function() {
		// Add loading bar
		mLoadingBackground = Game.add.sprite(Game.world.centerX - 95, Game.world.centerY - 50, 'loading-background');
		mLoadingBar = Game.add.sprite(mLoadingBackground.x, mLoadingBackground.y, 'loading-fill');
		Game.load.setPreloadSprite(mLoadingBar);

		// Assets made by myself
		Game.load.spritesheet('right-wrong', 'assets/right_wrong.png', 145, 207); // By Fernando Bevilacqua, public domain
		Game.load.image('pixel', 'assets/pixel.png'); // By Fernando Bevilacqua, public domain
		Game.load.image('tutorial-good', 'assets/tutorial_good.png?7'); // By Fernando Bevilacqua, public domain
		Game.load.image('tutorial-bad', 'assets/tutorial_bad.png?7'); // By Fernando Bevilacqua, public domain
		Game.load.image('tutorial-time', 'assets/tutorial_time.png'); // By Fernando Bevilacqua, public domain

		// Assets from external authors
		Game.load.spritesheet('card', 'assets/card.png?5', 100, 100); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.spritesheet('blue-button', 'assets/blue_button.png', 190, 49); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('dialog-small', 'assets/dialog_small.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('deck-background', 'assets/deck_background.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('quarter-dialog', 'assets/quarter_dialog.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('question-dialog', 'assets/question_dialog.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('time-dialog', 'assets/time_dialog.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('clock-bar', 'assets/clock_bar.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('trash', 'assets/trash.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('heart', 'assets/heart.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.spritesheet('monster', 'assets/monster.png', 150, 201); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('skull', 'assets/skull.png'); // Public domain

		// SFX
		Game.load.audio('sfx-right', 'assets/right.ogg'); // Fourier, CC-BY 3.0, https://soundcloud.com/third-octave
		Game.load.audio('sfx-wrong', 'assets/wrong.ogg'); // ViRiX, CC-BY 3.0, http://opengameart.org/content/ui-failed-or-error, "Some of the sounds in this project were created by David McKee (ViRiX) soundcloud.com/virix"
		Game.load.audio('sfx-new-question', 'assets/new_question.ogg'); // StumpyStrust, CC-0, http://opengameart.org/content/ui-sounds

		// Load all JS required to make the face tracking thing work.
		Game.load.script('camera.js', '../js/ftg.camera.js');
		Game.load.script('ftg.expression.js', '../js/ftg.expression.js?2');
		Game.load.script('ftg.collector.js', '../js/ftg.collector.js?1');
		Game.load.script('utils.js', '../js/3rdparty/clmtrackr/js/utils.js');
		Game.load.script('clmtrackr.js', '../js/3rdparty/clmtrackr/js/clmtrackr.js');
		Game.load.script('Stats.js', '../js/3rdparty/clmtrackr/js/Stats.js');
		Game.load.script('model_pca_20_svm_emotionDetection.js', '../js/3rdparty/clmtrackr/models/model_pca_20_svm_emotionDetection.js');
		Game.load.script('emotion_classifier.js', '../js/3rdparty/clmtrackr/examples/js/emotion_classifier.js');
		Game.load.script('emotionmodel.js', '../js/3rdparty/clmtrackr/examples/js/emotionmodel.js');
	};
};
