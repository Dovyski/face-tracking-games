/**
 * This class controls a gameplay experiment where the player is
 * invited to play all the games, one after another, while
 * some data are collected (facial expressions, etc).
 */

 var FTG = FTG || {};

 FTG.Experiment = function() {
     var mUid,
         mIntervalId,
         mState,
         mStateCounter,
         mCurrentGame,
         mGames = [
             {id: 1, name: 'test'}
         ];

    // Initialize the whole thing up
    this.init();
 };

// Define a few constants
FTG.Experiment.STATE_GREETINGS = 'greetings';
FTG.Experiment.STATE_PLAYING = 'playing';
FTG.Experiment.STATE_RESTING = 'resting';
FTG.Experiment.STATE_QUESTIONNAIRE = 'questionnaire';

// Singleton that will be used by all games
FTG.Experiment.instance = null;

// Methods

FTG.Experiment.prototype.init = function() {
    mState = FTG.Experiment.STATE_GREETINGS;
    mStateCounter = -1;
    mCurrentGame = 0;
    mUid = FTG.Utils.getURLParamByName('id');

    if(mUid == '') {
        alert('User id not informed!');
    } else {
        $('#info').html(
            '<h1>Instructions</h1>' +
            '<p>User: ' + mUid + '</p>' +
            '<p>Info info info</p>' +
            '<button>Start</button>'
        );

        $('#info button').click(function() {
            mState = FTG.Experiment.STATE_PLAYING;
        });
        mIntervalId = setInterval(this.update, 500);
    }
};

FTG.Experiment.prototype.update = function() {
    switch(mState) {
        case FTG.Experiment.STATE_GREETINGS:
            console.log('STATE_GREETINGS');
            break;

        case FTG.Experiment.STATE_PLAYING:
            console.log('STATE_PLAYING');
            break;

        case FTG.Experiment.STATE_RESTING:
            break;

        case FTG.Experiment.STATE_QUESTIONNAIRE:
            break;
    }
};

// Start the party!
$(function() {
    FTG.Experiment.instance = new FTG.Experiment();
});
