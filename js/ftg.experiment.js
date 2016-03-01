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
     this.mDebug;
     this.mFinished;
     this.mData;
     this.mBipSound;
     this.mTanSound;
     this.mCalmSound;

     this.mGames = [
         {id: 1, name: 'card-flipper', url: '../card-flipper/', width: 1300, height: 975, paddingLeft: 300},
         {id: 2, name: 'tetris', url: '../tetris/', width: 640, height: 960, paddingLeft: 600},
         {id: 3, name: 'platformer', url: '../platformer/', width: 1300, height: 975, paddingLeft: 300}
     ];

     this.mGamesSorting = [
         [0, 1, 2],
         [0, 2, 1],
         [1, 0, 2],
         [1, 2, 0],
         [2, 1, 0],
         [2, 0, 1],
     ];
     this.mSorting;

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
    this.mDebug = FTG.Utils.getURLParamByName('debug') || false;
    this.mBipSound = document.getElementById('bip');
    this.mTanSound = document.getElementById('tan');
    this.mCalmSound = document.getElementById('calm');
    this.mSorting = this.mUid ? this.mUid % this.mGamesSorting.length : 0;
    this.mFinished = false;

    this.mData = new FTG.Collector();

    this.mRestTime *= 60 * 1000;

    console.log('[Experiment] Init with user uid:' + this.mUid + ', rest: ' + this.mRestTime + ', facial tracking: ' + this.mEnableFaceTracking + ', sorting: ' + this.mSorting + ' [' + this.mGamesSorting[this.mSorting].join(',') + ']');

    // Warn the user before leaving the page
    window.onbeforeunload = function() {
        return 'You did something that will stop the study before it is over. Please, click "Stay on this Page" to resume your study.';
    };

    // Disable mouse right-click (prevent problems during the experiment)
    document.addEventListener('contextmenu', function(theEvent) {
        theEvent.preventDefault();
    	return false;
    }, false);

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
        this.mCalmSound.currentTime = 0;
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
            '<button id="start">Start</button> <button id="heart">HR watch</button>' +
        '</div>'
    );

    $('#start').click(function() {
        aSelf.startNewGame();
    });

    $('#heart').click(function() {
        aSelf.mData.logMilestone(aSelf.mUid, -1, 'experiment_hr_start');
        aSelf.playBipSound();
        $(this).hide();
    });

    // Play the bip sound to indicate everything is set.
    this.playBipSound();
};

FTG.Experiment.prototype.generateGameURL = function(theGameInfo) {
    return theGameInfo.url + '?user=' + this.mUid + '&game=' + theGameInfo.id + '&rand=' + Math.random() + '&face=' + this.mEnableFaceTracking;
};

FTG.Experiment.prototype.startNewGame = function() {
    var aGame;

    if(this.anyMoreGamesToPlay()) {
        this.mCurrentGame++;
        aGame = this.getCurrentGame();

        console.log('[Experiment] New game about to start: ' + aGame.name + ' (id=' + aGame.id + ')');
        this.playTanSound();
        this.mData.logMilestone(this.mUid, aGame.id, 'experiment_game_start');

        // Add the game iframe and ajust its src property (prevent chache issues)
        $('#info').html('<iframe id="game" style="width: ' + aGame.width + 'px; height: ' + aGame.height + 'px; padding-left: ' + aGame.paddingLeft + 'px;"></iframe>');
        document.getElementById('game').src = this.generateGameURL(aGame);

        if(this.mDebug) {
            var aSelf = this;

            $('#info').append('<button id="conclude">Conclude</button>');
            $('#conclude').click(function() {
                aSelf.concludeCurrentGame();
            });
        }

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

            if(aSelf.anyMoreGamesToPlay()) {
                aSelf.rest();
            } else {
                aSelf.finish();
            }

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
    this.mData.logMilestone(this.mUid, aGame.id, 'experiment_game_end');

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
    this.mData.logMilestone(this.mUid, -1, 'experiment_rest_start');

    this.enableCalmMusic(true);
    $('#info').html('<div class="rest-container"><div><h1>Please, relax.</h1><p>Next game will start in a moment...</p></div></div>');

    aId = setInterval(function() {
        var aRemaining = aFuture - Date.now();

        if(aRemaining <= 0) {
            clearInterval(aId);
            aSelf.enableCalmMusic(false);
            aSelf.startNewGame();
        }
    }, 200);
};

FTG.Experiment.prototype.finish = function() {
    if(this.mFinished) {
        this.sendSubjectHome();
        return;
    }

    console.log('[Experiment] Finishing up. Last chance to ask anything.');
    this.playTanSound();
    this.mData.logMilestone(this.mUid, -1, 'experiment_final_questions_start');

    $('#info').html(
        '<div class="questionnaire">' +
            '<h2>Questions</h2>' +
            '<p>Please tell us a bit about you.</p>' +
            '<div id="questions" class="questions"></div>' +
        '</div>'
    );

    aQuestions = new FTG.Questionnaire(
        'questions',
        this.mUid,
        -1, // no game
        FTG.Questions.User,
        this.concludeCurrentQuestionnaire,
        this
    );

    this.mFinished = true;
};

FTG.Experiment.prototype.sendSubjectHome = function() {
    console.log('[Experiment] The party is over! Last one to leave turn off the lights.');
    $('#info').html('<div class="rest-container"><div><h1>The end!</h1><p>You are good to go. Thank you for helping us help you help us all! :)</p></div></div>');

    this.mData.logMilestone(this.mUid, -1, 'experiment_end');
};

FTG.Experiment.prototype.getCurrentGame = function() {
    return this.mGames[this.mGamesSorting[this.mSorting][this.mCurrentGame]];
};

FTG.Experiment.prototype.anyMoreGamesToPlay = function() {
    return (this.mCurrentGame + 1) < this.mGamesSorting[this.mSorting].length;
};

// Start the party!
$(function() {
    FTG.Experiment.instance = new FTG.Experiment();
});
