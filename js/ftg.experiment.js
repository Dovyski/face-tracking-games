/**
 * This class controls a gameplay experiment where the player is
 * invited to play all the games, one after another, while
 * some data are collected (facial expressions, etc).
 */

 var FTG = FTG || {};

 FTG.Experiment = function() {
     this.mUid;
     this.mCurrentGame;
     this.mRestTime;
     this.mGames = [
         {id: 1, name: 'card-flipper', url: '../card-flipper/', width: 1024, height: 768},
         {id: 2, name: 'tetris', url: '../tetris/', width: 640, height: 480},
         {id: 3, name: 'platformer', url: '../platformer/', width: 1024, height: 768}
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
    this.mRestTime = FTG.Utils.getURLParamByName('rest') || 60000;

    console.log('[Experiment] Init with user uid:' + this.mUid + ', rest: ' + this.mRestTime);

    if(this.mUid == null) {
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

FTG.Experiment.prototype.generateGameURL = function(theBaseURL) {
    return theBaseURL + '?id=' + this.mUid;
};

FTG.Experiment.prototype.startNewGame = function() {
    var aGame;

    this.mCurrentGame++;

    if(this.anyMoreGamesToPlay()) {
        aGame = this.getCurrentGame();

        console.log('[Experiment] New game about to start: ' + aGame.name + ' (id=' + aGame.id + ')');
        $('#info').html('<iframe src="' + this.generateGameURL(aGame.url) + '" style="width: ' + aGame.width + 'px; height: ' + aGame.height + 'px;"></iframe>');

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

FTG.Experiment.prototype.concludeCurrentQuestionnaire = function(theAnswers) {
    var aSelf = this;

    $.ajax({
        url: "../backend/",
        method: 'POST',
        data: 'uid=0&game=0&' + theAnswers,
        dataType: 'json'
    }).done(function(theData) {
        aSelf.rest();
    }).fail(function(theXHR, theText) {
        console.error('Something wrong: ' + theXHR.responseText, theXHR, theText);
    });

    // TODO: remove this block
    $('#info').append('<button>Continue</button>');
    $('#info button').click(function() {
        aSelf.rest();
    });
};

FTG.Experiment.prototype.concludeCurrentGame = function() {
    var aGame,
        aQuestions;

    aGame = this.getCurrentGame();

    console.log('[Experiment] Current game (' + aGame.name + ', id=' + aGame.id + ') was concluded.');
    $('#info').html('<h2>Question</h2><p>Regarding the game you just played, please answer the questions below.</p>');

    aQuestions = new FTG.Questionnaire('info', this.mUid, aGame.id, this.concludeCurrentQuestionnaire, this);
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
