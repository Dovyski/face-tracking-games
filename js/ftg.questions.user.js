/**
 * A a few question for each user of the experiment.
 */

 var FTG = FTG || {};

 FTG.Questions = FTG.Questions || {};

 FTG.Questions.User = [
     {
         text: 'How old are you? (please answer in years)',
         input: true,
     },
     {
         text: 'What is the number of hours per week that you had played any type of video game over the last year?',
         hide: true,
         options: [
             {value: 1, label: 'Never'},
             {value: 2, label: '0 to 1'},
             {value: 3, label: '1 to 3'},
             {value: 4, label: '3 to 5'},
             {value: 5, label: '5 to 10'},
             {value: 5, label: 'More than 10'}
         ]
     },
     {
         text: 'How proficient or skilled do you believe you are at playing video games?',
         hide: true,
         options: [
             {value: 1, label: 'Very skilled'},
             {value: 2, label: 'Moderately skilled'},
             {value: 3, label: 'Not very skilled1 to 3'},
             {value: 4, label: 'No skill'}
         ]
     },
 ];
