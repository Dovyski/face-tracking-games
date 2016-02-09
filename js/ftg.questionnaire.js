/**
 * This class implements a questionnaire.
 */

 var FTG = FTG || {};

 FTG.Questionnaire = function(theContainerId, theUserId, theGameId, theDoneCallback, theCallbackContext) {
     this.mContainerId = theContainerId;
     this.mUserId = theUserId;
     this.mGameId = theGameId;
     this.mDoneCallback = theDoneCallback;
     this.mCallbackContext = theCallbackContext || this;
     this.mQuestions = [
         {
             text: 'On a scale from 1 to 5, how <em>bored</em> did you feel at the <em>beginning</em> of the game?',
             options: [
                 {value: 1, label: '(Not bored at all)'},
                 {value: 2, label: ''},
                 {value: 3, label: ''},
                 {value: 4, label: ''},
                 {value: 5, label: '(Extremely bored)'}
             ]
         },
         {
             text: 'On a scale from 1 to 5, how <em>stressed</em> did you feel at the <em>beginning</em> of the game?',
             options: [
                 {value: 1, label: '(Not stressed at all)'},
                 {value: 2, label: ''},
                 {value: 3, label: ''},
                 {value: 4, label: ''},
                 {value: 5, label: '(Extremely stressed)'}
             ]
         },
         {
             text: 'On a scale from 1 to 5, how <em>bored</em> did you feel at the <em>end</em> of the game?',
             options: [
                 {value: 1, label: '(Not bored at all)'},
                 {value: 2, label: ''},
                 {value: 3, label: ''},
                 {value: 4, label: ''},
                 {value: 5, label: '(Extremely bored)'}
             ]
         },
         {
             text: 'On a scale from 1 to 5, how <em>stressed</em> did you feel at the <em>end</em> of the game?',
             options: [
                 {value: 1, label: '(Not stressed at all)'},
                 {value: 2, label: ''},
                 {value: 3, label: ''},
                 {value: 4, label: ''},
                 {value: 5, label: '(Extremely stressed)'}
             ]
         },
         {
             text: 'On a scale from 1 to 5 (1: initial moments of the game, 5: final moments of the game), which part would <em>best</em> describe the moment you enjoyed the most (e.g. had more fun)?',
             options: [
                 {value: 1, label: ''},
                 {value: 2, label: ''},
                 {value: 3, label: ''},
                 {value: 4, label: ''},
                 {value: 5, label: ''}
             ]
         },
     ];

     this.init();
 };

// Methods

FTG.Questionnaire.prototype.init = function() {
    var i,
        j,
        aDiv,
        aId,
        aQuestion,
        aSelf = this,
        aContent = '';

    for(i = 0; i < this.mQuestions.length; i++) {
        aQuestion = this.mQuestions[i];
        aContent += '<div class="question"><p id="q' + i + '">' + (i + 1) + ') ' + aQuestion.text + '</p>';

        for(j = 0; j < aQuestion.options.length; j++) {
            aId = 'id' + i + j;
            aContent +=
                '<input type="radio" name="a' + i + '" value="' + aQuestion.options[j].value + '" id="' + aId + '"/> ' +
                '<label for="' + aId + '">' + aQuestion.options[j].value + ' ' + aQuestion.options[j].label + '</label>';
        }
        aContent += '</div>';
    }

    $('#' + this.mContainerId).append('<form id="ftg-questionnaire">' + aContent + '</form>');

    $('#ftg-questionnaire input:radio').change(function() {
        var aAnswered = $('#ftg-questionnaire input:radio:checked').length;

        if(aAnswered >= aSelf.mQuestions.length) {
            aSelf.finish();
        }
    });
};

FTG.Questionnaire.prototype.finish = function() {
    var aData = [],
        i;

    for(i = 0; i < this.mQuestions.length; i++) {
        aData.push({q: $('#q' + i).html(), a: $('#ftg-questionnaire input:radio[name="a' + i + '"]:checked').val()});
    }

    this.mDoneCallback.call(this.mCallbackContext, aData);
};
