/**
 * Loads all assets used by the game
 */

var LoadState = function() {
	var mLoadingBackground,
		mLoadingBar;

	this.create = function() {
		Game.state.start('tutorial');
	};

	this.preload = function() {
		// Add loading bar
		mLoadingBackground = Game.add.sprite(Game.world.centerX - 95, Game.world.centerY - 50, 'loading-background');
		mLoadingBar = Game.add.sprite(mLoadingBackground.x, mLoadingBackground.y, 'loading-fill');
		this.game.load.setPreloadSprite(mLoadingBar);

		// Assets by myself
		this.load.image('pixel', 'assets/pixel.png'); // By Fernando Bevilacqua, public domain
		this.load.image('tutorial', 'assets/tutorial.png');

		// Assets from external authors
		this.game.load.spritesheet('player', 'assets/player.png', 74, 128); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.image('platform', 'assets/platform.png?1'); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.image('slope-up', 'assets/slope-up.png'); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.image('slope-down', 'assets/slope-down.png'); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.image('obstacle-bottom', 'assets/obstacle-bottom.png'); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.image('obstacle-top', 'assets/obstacle-top.png'); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.spritesheet('dust', 'assets/dust.png', 64, 40); // ansimuz, Public domain, http://opengameart.org/content/animated-explosions
		this.game.load.image('water', 'assets/water.png');  // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.spritesheet('clouds', 'assets/clouds.png', 192, 60);  // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites

		Game.load.image('heart', 'assets/heart.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl

		Game.load.spritesheet('card', 'assets/card.png?2', 100, 100); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.spritesheet('blue-button', 'assets/blue_button.png', 190, 49); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('dialog-small', 'assets/dialog_small.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('quarter-dialog', 'assets/quarter_dialog.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('question-dialog', 'assets/question_dialog.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		Game.load.image('time-dialog', 'assets/time_dialog.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl

		// SFX
		Game.load.audio('sfx-hurt', 'assets/sfx/slightscream-04.mp3'); // Iwan Gabovitch, CC-BY-SA 3.0, http://opengameart.org/content/15-vocal-male-strainhurtpainjump-sounds
		Game.load.audio('sfx-jump', 'assets/sfx/slightscream-01.mp3'); // Iwan Gabovitch, CC-BY-SA 3.0, http://opengameart.org/content/15-vocal-male-strainhurtpainjump-sounds
		Game.load.audio('sfx-heart', 'assets/sfx/coin1.mp3'); // Luke.RUSTLTD, CC-0, http://opengameart.org/content/10-8bit-coin-sounds
		Game.load.audio('sfx-dash', 'assets/sfx/rustle13.mp3'); // qubodup, CC-0, http://opengameart.org/content/20-rustles-dry-leaves
		Game.load.audio('sfx-music', 'assets/sfx/music.mp3'); // RevampedPRO, CC-BY 3.0, http://opengameart.org/content/platformer-game-music-pack

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
