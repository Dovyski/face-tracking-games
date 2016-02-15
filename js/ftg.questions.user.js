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
             {value: 3, label: 'Not very skilled'},
             {value: 4, label: 'No skill'}
         ]
     },
     {
         text: 'Compared to your regular/usual daily state of mind, how are you feeling today?',
         hide: true,
         options: [
             {value: 1, label: 'Unusually calm and relaxed'},
             {value: 2, label: 'A bit more calm and relaxed than usual'},
             {value: 3, label: 'Normal (calm and/or stressed as usual'},
             {value: 4, label: 'A bit more stressed than usual'},
             {value: 4, label: 'Unusually stressed'}
         ]
     },
     {
         text: 'Which of the following profiles describes you better in terms of what type of digital game player you are?',
         hide: true,
         options: [
             {value: 1, label: 'I don’t like challenges, I just want easy games (they are fun)'},
             {value: 2, label: 'I like challenging games, the more difficult, the better'}
         ]
     },
 ];
