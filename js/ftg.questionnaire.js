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
             text: 'my question?1',
             options: [
                 {value: 1, label: 'Not bored'},
                 {value: 2, label: 'Bored2'},
                 {value: 3, label: 'Neutral'},
                 {value: 4, label: 'Bored4'},
                 {value: 5, label: 'Bored5'},
             ]
         },
         {
             text: 'my question?2',
             options: [
                 {value: 1, label: 'Not bored'},
                 {value: 2, label: 'Bored2'},
                 {value: 3, label: 'Neutral'},
                 {value: 4, label: 'Bored4'},
                 {value: 5, label: 'Bored5'},
             ]
         }
     ];

     this.init();
 };

// Methods

FTG.Questionnaire.prototype.init = function() {
    var i,
        j,
        aQuestion,
        aContent = '';

    for(i = 0; i < this.mQuestions.length; i++) {
        aQuestion = this.mQuestions[i];
        aContent += '<p>' + aQuestion.text + '</p>';

        for(j = 0; j < aQuestion.options.length; j++) {
            aContent +=
                '<input type="radio" name="q' + i + '" value="' + aQuestion.options[j].value + '" /> ' +
                aQuestion.options[j].value + ' (' + aQuestion.options[j].label + ')';
        }
    }

    $('#' + this.mContainerId).append('<form id="ftg-questionnaire">' + aContent + '</form>');
};
