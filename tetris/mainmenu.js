/* Made by Nambiar - Game Dolphin

Feel free to use and learn from */

Game.MainMenu = function(game){



};



Game.MainMenu.prototype = {

	create : function(){
		this.stage.backgroundColor = 0x000;

		this.game.world.bounds.x = 0;

		this.game.world.bounds.y = 0;

		this.game.world.bounds.width = 400;

		this.game.world.bounds.height = 600;

		this.playbutton = this.add.button(this.game.world.centerX, this.game.world.centerY-40,'play',this.playclicked,this,1,0,2);

		this.playbutton.anchor.setTo(0.5,0.5);

		this.tweenplay = this.game.add.tween(this.playbutton).to({y:300},1000,Phaser.Easing.Sinusoidal.InOut,true,0,100,true);



		this.arrows = this.game.add.sprite(this.game.world.centerX,this.game.world.centerY+180,'arrow');

		this.arrows.anchor.setTo(0.5,0.5);

		this.arrows.scale.setTo(0.6,0.6);



		this.titleimage = this.add.sprite(this.game.world.centerX,0,'title');

		this.titleimage.anchor.setTo(0.5,0);

		// The id of this game if it has not been already
		GlobalInfo.game = GlobalInfo.game || 2;
		GlobalInfo.data.logMilestone(GlobalInfo.user, GlobalInfo.game, 'menu_start');
	},



	playclicked : function() {

		score = 0;
		GlobalInfo.data.logMilestone(GlobalInfo.user, GlobalInfo.game, 'game_start');
		this.game.state.start('Game');

	},



};





Game.LoseScreen = function(game){



};



Game.LoseScreen.prototype = {

	create : function(){

		this.game.world.bounds.x = 0;

		this.game.world.bounds.y = 0;

		this.game.world.bounds.width = 400;

		this.game.world.bounds.height = 600;

		this.lose = this.game.add.text(this.game.world.centerX,this.game.world.centerY,'Game over.\nClick the "Next" button above\n to continue', { font: "24px Arial", fill: "#fff", align: "center" });

		this.lose.anchor.setTo(0.5,0.5);

		this.playbutton = this.add.button(this.game.world.centerX, 40, 'next',this.playclicked,this,1,0,2);

		this.playbutton.anchor.setTo(0.5,0.5);

		this.tweenplay = this.game.add.tween(this.playbutton).to({y:50},1000,Phaser.Easing.Sinusoidal.InOut,true,0,100,true);

		this.scoretextmain = this.add.text(this.game.world.centerX,450,score,{ font: "40px Arial", fill: "#fff", align: "center" })

		this.scoretextmain.anchor.setTo(0.5,0.5);

		GlobalInfo.data.logMilestone(GlobalInfo.user, GlobalInfo.game, 'game_end');
	},

	update : function() {
		if(this.game.input.activePointer.isDown) {
			this.playclicked();
		}
	},

	playclicked : function() {
		if(GlobalInfo.experiment) {
			GlobalInfo.experiment.concludeCurrentGame();

		} else {
			score = 0;
			this.game.state.start('Game');
		}
	},
};
