/**
 * This class controls a gameplay experiment where the player is
 * invited to play all the games, one after another, while
 * some data are collected (facial expressions, etc).
 */

 var FTG = FTG || {};

 FTG.Experiment = function() {
     this.mUid;
     this.mCurrentGame;
     this.mGames = [
         {id: 1, name: 'test1'},
         {id: 2, name: 'test2'},
         {id: 3, name: 'test3'},
     ];

    // Initialize the whole thing up
    this.init();
 };

// Singleton that will be used by all games
FTG.Experiment.instance = null;

// Methods

FTG.Experiment.prototype.init = function() {
    this.mUid = FTG.Utils.getURLParamByName('id');
    this.mCurrentGame = -1;

    console.log('[Experiment] Init with user uid ' + this.mUid);

    if(this.mUid == '') {
        alert('User id not informed!');
    } else {
        this.greetings();
    }
};

FTG.Experiment.prototype.greetings = function() {
    var aSelf = this;

    $('#info').html(
        '<h1>Instructions</h1>' +
        '<p>User: ' + this.mUid + '</p>' +
        '<p>Info info info</p>' +
        '<button>Start</button>'
    );

    $('#info button').click(function() {
        aSelf.startNewGame();
    });
};

FTG.Experiment.prototype.startNewGame = function() {
    var aGame;

    this.mCurrentGame++;

    if(this.anyMoreGamesToPlay()) {
        aGame = this.getCurrentGame();
        console.log('[Experiment] New game about to start: ' + aGame.name + ' (id=' + aGame.id + ')');
        $('#info').html('game has started ' + aGame.name + ', ' + aGame.id);

        // TODO: remove this block
        $('#info').append('<button>Conclude</button>');
        var aSelf = this;
        $('#info button').click(function() {
            aSelf.concludeCurrentGame();
        });

    } else {
        console.log('[Experiment] No more games to play, finishing now');
        this.finish();
    }
};

FTG.Experiment.prototype.concludeCurrentGame = function() {
    var aGame;

    aGame = this.getCurrentGame();
    $('#info').html('game has been concluded ' + aGame.name + ', ' + aGame.id);
    $('#info').append('Questions here');

    // TODO: remove this block
    $('#info').append('<button>Continue</button>');
    var aSelf = this;
    $('#info button').click(function() {
        // TODO: move this to a new method
        if(aSelf.anyMoreGamesToPlay()) {
            aSelf.rest();
        } else {
            console.log('[Experiment] No more games to play, finishing now');
            aSelf.finish();
        }
    });

    console.log('[Experiment] Current game (' + aGame.name + ', id=' + aGame.id + ') was concluded.');
};

FTG.Experiment.prototype.rest = function() {
    var aFuture = Date.now() + 5000,
        aSelf = this,
        aId;

    console.log('[Experiment] Resting for SSS seconds...');

    aId = setInterval(function() {
        var aRemaining = aFuture - Date.now();

        if(aRemaining <= 0) {
            clearInterval(aId);
            aSelf.startNewGame();

        } else {
            $('#info').html('Rest...' + aRemaining / 1000);
        }
    }, 200);
};

FTG.Experiment.prototype.finish = function() {
    console.log('[Experiment] The party is over! Last one to leave turns off the lights.');
    $('#info').html('Finish');
};

FTG.Experiment.prototype.getCurrentGame = function() {
    // TODO: return game according to user id
    return this.mGames[this.mCurrentGame];
};

FTG.Experiment.prototype.anyMoreGamesToPlay = function() {
    return this.mCurrentGame < this.mGames.length;
};

// Start the party!
$(function() {
    FTG.Experiment.instance = new FTG.Experiment();
});
