/**
 * A set of question to be used after each game in an experiment.
 */

 var FTG = FTG || {};

 FTG.Questions = FTG.Questions || {};

 FTG.Questions.Game = [
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
         text: 'Which part of the game would <em>best</em> describe the moment you enjoyed the most (e.g. had more fun)?',
         options: [
             {value: 1, label: '(Very beginning)'},
             {value: 2, label: '(After beginning and before middle)'},
             {value: 3, label: '(Middle)'},
             {value: 4, label: '(After middle and before end)'},
             {value: 5, label: '(Very end)'}
         ]
     },
     {
         text: 'Did you understand how to play the game properly?',
         hide: true,
         options: [
             {value: 2, label: 'Yes'},
             {value: 1, label: 'Yes, but I was a bit confused'},
             {value: 0, label: 'No'}
         ]
     },
 ];
