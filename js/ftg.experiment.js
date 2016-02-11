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
     this.mEnableFaceTracking;
     this.mBipSound;
     this.mTanSound;
     this.mCalmSound;

     this.mGames = [
         {id: 3, name: 'platformer', url: '../platformer/', width: 1024, height: 768},
         {id: 2, name: 'tetris', url: '../tetris/', width: 1024, height: 800},
         {id: 1, name: 'card-flipper', url: '../card-flipper/', width: 1524, height: 768}
     ];

    // Initialize the whole thing up
    this.init();
 };

// Singleton that will be used by all games
FTG.Experiment.instance = null;

// Methods

FTG.Experiment.prototype.init = function() {
    this.mUid = FTG.Utils.getURLParamByName('user');

    this.mCurrentGame = -1; // TODO: get from URL.
    this.mRestTime = FTG.Utils.getURLParamByName('rest') || 3;
    this.mEnableFaceTracking = FTG.Utils.getURLParamByName('face') || false;
    this.mBipSound = document.getElementById('bip');
    this.mTanSound = document.getElementById('tan');
    this.mCalmSound = document.getElementById('calm');

    this.mRestTime *= 60 * 1000;

    console.log('[Experiment] Init with user uid:' + this.mUid + ', rest: ' + this.mRestTime + ', facial tracking: ' + this.mEnableFaceTracking);

    if(this.mUid == null) {
        alert('User id not informed! Append ?user=DDD to the URL.');
    } else {
        // Reverse the order of the games for a subset of users.
        if(this.mUid % 2 == 0) {
            this.mGames.reverse();
        }
        this.greetings();
    }
};

FTG.Experiment.prototype.enableCalmMusic = function(theStatus) {
    if(theStatus) {
        this.mCalmSound.loop = true;
        this.mCalmSound.play();
    } else {
        this.mCalmSound.pause();
    }
};

FTG.Experiment.prototype.playBipSound = function() {
    this.mBipSound.currentTime = 0;
    this.mBipSound.play();
};

FTG.Experiment.prototype.playTanSound = function() {
    this.mTanSound.currentTime = 0;
    this.mTanSound.play();
};

FTG.Experiment.prototype.greetings = function() {
    var aSelf = this;

    $('#info').html(
        '<div class="greetings">' +
            '<h1>Instructions</h1>' +
            '<p>User: ' + this.mUid + '</p>' +
            '<p>Welcome! Please wait the researcher let you know when to start.<br/>When you are told to start, click the "Start" button below.<br /><br />Thank you for being part of this research!</p>' +
            '<button>Start</button>' +
        '</div>'
    );

    $('#info button').click(function() {
        aSelf.startNewGame();
    });

    // Play the bip sound to indicate everything is set.
    this.playBipSound();
};

FTG.Experiment.prototype.generateGameURL = function(theGameInfo) {
    return theGameInfo.url + '?user=' + this.mUid + '&game=' + theGameInfo.id + '&rand=' + Math.random() + '&face=' + this.mEnableFaceTracking;
};

FTG.Experiment.prototype.startNewGame = function() {
    var aGame;

    this.mCurrentGame++;

    if(this.anyMoreGamesToPlay()) {
        aGame = this.getCurrentGame();

        console.log('[Experiment] New game about to start: ' + aGame.name + ' (id=' + aGame.id + ')');
        this.playBipSound();

        // Add the game iframe and ajust its src property (prevent chache issues)
        $('#info').html('<iframe id="game" style="width: ' + aGame.width + 'px; height: ' + aGame.height + 'px;"></iframe>');
        document.getElementById('game').src = this.generateGameURL(aGame);

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

FTG.Experiment.prototype.concludeCurrentQuestionnaire = function(theData) {
    var aSelf = this;

    console.log('[Experiment] Sending questionnaire data.', theData);

    $.ajax({
        url: '../backend/',
        method: 'POST',
        data: {
            method: 'answer',
            user: this.mUid,
            game: this.getCurrentGame().id,
            data: JSON.stringify({t: Date.now(), d: theData})
        },
        dataType: 'json'

    }).done(function(theData) {
        if(theData.success) {
            console.log('[Experiment] Questionnaire data has been saved!');
            aSelf.rest();
        } else {
            console.error('[Experiment] Backend didn\'t like the answers: ' + theData.message);
        }
    }).fail(function(theXHR, theText) {
        // TODO: show some user friendly messages?
        console.error('Something wrong: ' + theXHR.responseText, theXHR, theText);
    });
};

FTG.Experiment.prototype.concludeCurrentGame = function() {
    var aGame,
        aQuestions;

    aGame = this.getCurrentGame();

    console.log('[Experiment] Current game (' + aGame.name + ', id=' + aGame.id + ') was concluded.');
    this.playTanSound();

    $('#info').html(
        '<div class="questionnaire">' +
            '<h2>Questions</h2>' +
            '<p>Regarding the game you just played, please answer the questions below.</p>' +
            '<div id="questions" class="questions"></div>' +
        '</div>'
    );

    aQuestions = new FTG.Questionnaire(
        'questions',
        this.mUid,
        aGame.id,
        FTG.Questions.Game,
        this.concludeCurrentQuestionnaire,
        this
    );
};

FTG.Experiment.prototype.rest = function() {
    var aFuture = Date.now() + this.mRestTime,
        aSelf = this,
        aId;

    console.log('[Experiment] Resting for ' + (this.mRestTime/1000) + ' seconds...');

    this.enableCalmMusic(true);

    aId = setInterval(function() {
        var aRemaining = aFuture - Date.now();

        if(aRemaining <= 0) {
            clearInterval(aId);
            aSelf.enableCalmMusic(false);
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
