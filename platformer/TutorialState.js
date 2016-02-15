/**
 * Teaches about controls and stuff.
 */

TutorialState = function() {
	var mFigure,
		mTextClick,
		mTitle;

	this.create = function() {
		this.game.stage.backgroundColor = '#5FCDE4';

		mFigure = this.game.add.sprite(0, 0, 'tutorial');
		mTextClick = this.game.add.text(this.game.world.centerX, this.game.world.height - 150, "Click anywhere to continue", { font: "26px Arial", fill: "#ffffff", align: "center" });
		mTitle = this.game.add.text(this.game.world.centerX, 50, "Instructions", { font: "Bold 40px Arial", fill: "#000", align: "center" });

		mTextClick.anchor.setTo(0.5);
		mTitle.anchor.setTo(0.5);

		this.game.add.tween(mTextClick).to({alpha: 0.4}, 300, Phaser.Easing.Linear.None, true, 0, -1, true).start();
	};

	this.update = function() {
		if(this.game.input.activePointer.isDown) {
			GlobalInfo.data.logMilestone(GlobalInfo.user, GlobalInfo.game, 'game_start');
			this.game.state.start('play');
		}
	};
};
