/**
 * This class implements a questionnaire.
 */

 var FTG = FTG || {};

 FTG.Questionnaire = function(theContainerId, theUserId, theGameId, theQuestions, theDoneCallback, theCallbackContext) {
     this.mContainerId = theContainerId;
     this.mUserId = theUserId;
     this.mGameId = theGameId;
     this.mDoneCallback = theDoneCallback;
     this.mCallbackContext = theCallbackContext || this;
     this.mQuestions = theQuestions;

     this.init();
 };

// Methods

FTG.Questionnaire.prototype.init = function() {
    var aSelf = this;

    $('#' + this.mContainerId).append('<div id="ftg-questionnaire">' + this.render() + '<button id="ftg-btn-submit">Submit</button></div>');

    $('#ftg-btn-submit').click(function() {
        aSelf.finish();
    });
};

FTG.Questionnaire.prototype.render = function() {
    var i,
        j,
        aId,
        aQuestion,
        aContent = '';

    for(i = 0; i < this.mQuestions.length; i++) {
        aQuestion = this.mQuestions[i];
        aContent += '<div class="question"><p id="q' + i + '">' + (i + 1) + ') ' + aQuestion.text + '</p>';

        if(aQuestion.options) {
            for(j = 0; j < aQuestion.options.length; j++) {
                aId = 'id' + i + j;
                aContent +=
                    '<input type="radio" name="a' + i + '" value="' + aQuestion.options[j].value + '" id="' + aId + '"/> ' +
                    '<label for="' + aId + '">' + aQuestion.options[j].value + ' ' + aQuestion.options[j].label + '</label>';
            }
        } else if(aQuestion.input) {
            aContent += '<input type="text" name="t' + i + '" value="" />';
        }

        aContent += '</div>';
    }

    return aContent;
};

FTG.Questionnaire.prototype.finish = function() {
    var aData = [],
        i,
        aQuestion,
        aAnswer,
        aAnswered = 0;

    for(i = 0; i < this.mQuestions.length; i++) {
        aQuestion = this.mQuestions[i];

        $('#q' + i).removeClass('error');

        if(aQuestion.options) {
            aAnswer = $('#ftg-questionnaire input:radio[name="a' + i + '"]:checked').val();

        } else if(aQuestion.input) {
            aAnswer = $('#ftg-questionnaire input:text[name="t' + i + '"]').val();
        }

        if(aAnswer && aAnswer != '') {
            aData.push({q: $('#q' + i).html(), a: aAnswer});

        } else {
            $('#q' + i).addClass('error').fadeOut('fast').fadeIn();
        }
    }

    if(aData.length == this.mQuestions.length) {
        this.mDoneCallback.call(this.mCallbackContext, aData);
    }
};
