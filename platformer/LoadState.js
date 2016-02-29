/**
 * Loads all assets used by the game
 */

var LoadState = function() {
	var mLoadingBackground,
		mLoadingBar;

	this.create = function() {
		this.game.state.start('setup');
	};

	this.preload = function() {
		// Add loading bar
		mLoadingBackground = Game.add.sprite(Game.world.centerX - 95, Game.world.centerY - 50, 'loading-background');
		mLoadingBar = Game.add.sprite(mLoadingBackground.x, mLoadingBackground.y, 'loading-fill');
		this.game.load.setPreloadSprite(mLoadingBar);

		// Assets by myself
		this.game.load.image('pixel', 'assets/pixel.png'); // By Fernando Bevilacqua, public domain

		// Assets from external authors
		this.game.load.spritesheet('player', 'assets/player.png?1', 84, 110); // Jan124, OGA-BY 3.0, http://opengameart.org/content/pixel-dinosaurs
		this.game.load.image('platform', 'assets/platform.png?1'); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.image('slope-up', 'assets/slope-up.png'); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.image('slope-down', 'assets/slope-down.png'); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.image('obstacle-bottom', 'assets/obstacle-bottom.png'); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.image('obstacle-top', 'assets/obstacle-top.png'); // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.spritesheet('dust', 'assets/dust.png', 64, 40); // ansimuz, Public domain, http://opengameart.org/content/animated-explosions
		this.game.load.image('water', 'assets/water.png');  // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.spritesheet('clouds', 'assets/clouds.png', 192, 60);  // Contributors, CC-BY 3.0, http://opengameart.org/content/open-pixel-platformer-tiles-sprites
		this.game.load.image('tutorial', 'assets/tutorial.png?2'); // xelu, Public Domain, http://opengameart.org/content/free-keyboard-and-controllers-prompts-pack
		this.game.load.image('key-up', 'assets/key-up.png'); // xelu, Public Domain, http://opengameart.org/content/free-keyboard-and-controllers-prompts-pack
		this.game.load.image('key-s', 'assets/key-s.png'); // xelu, Public Domain, http://opengameart.org/content/free-keyboard-and-controllers-prompts-pack
		this.game.load.image('heart', 'assets/heart.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		this.game.load.spritesheet('blue-button', 'assets/blue_button.png', 190, 49); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl
		this.game.load.image('dialog-small', 'assets/dialog_small.png'); // UI pack, by Kenney Vleugels (www.kenney.nl), CC0, http://www.kenney.nl

		// SFX
		this.game.load.audio('sfx-hurt', 'assets/sfx/slightscream-04.mp3'); // Iwan Gabovitch, CC-BY-SA 3.0, http://opengameart.org/content/15-vocal-male-strainhurtpainjump-sounds
		this.game.load.audio('sfx-jump', 'assets/sfx/slightscream-01.mp3'); // Iwan Gabovitch, CC-BY-SA 3.0, http://opengameart.org/content/15-vocal-male-strainhurtpainjump-sounds
		this.game.load.audio('sfx-heart', 'assets/sfx/coin1.mp3'); // Luke.RUSTLTD, CC-0, http://opengameart.org/content/10-8bit-coin-sounds
		this.game.load.audio('sfx-dash', 'assets/sfx/rustle13.mp3'); // qubodup, CC-0, http://opengameart.org/content/20-rustles-dry-leaves
		this.game.load.audio('sfx-music', 'assets/sfx/music.mp3'); // RevampedPRO, CC-BY 3.0, http://opengameart.org/content/platformer-game-music-pack

		// Load all JS required to make the face tracking thing work.
		this.game.load.script('camera.js', '../js/ftg.camera.js');
		this.game.load.script('ftg.expression.js', '../js/ftg.expression.js?2');
		this.game.load.script('ftg.collector.js', '../js/ftg.collector.js?1');
		this.game.load.script('utils.js', '../js/3rdparty/clmtrackr/js/utils.js');
		this.game.load.script('clmtrackr.js', '../js/3rdparty/clmtrackr/js/clmtrackr.js');
		this.game.load.script('Stats.js', '../js/3rdparty/clmtrackr/js/Stats.js');
		this.game.load.script('model_pca_20_svm_emotionDetection.js', '../js/3rdparty/clmtrackr/models/model_pca_20_svm_emotionDetection.js');
		this.game.load.script('emotion_classifier.js', '../js/3rdparty/clmtrackr/examples/js/emotion_classifier.js');
		this.game.load.script('emotionmodel.js', '../js/3rdparty/clmtrackr/examples/js/emotionmodel.js');
	};
};
