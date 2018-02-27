
var game = {
    score: {
        correct:0,
        incorrect:0,
        unanswered:0
    },
    groups: [
        {
            question: '',
            answer: '',
            choices: {
                correct: [],
                incorrect: []
            }
        }
    ],
    timer: {
        countFrom: 30,
        countTo: 0,
        currentInterval: 0,
        currentTime: 30,
        convertime: function(t, type){
            var convertedTime = t;
            switch(type){
                case 'ms2sec':
                    break;
                case 'sec2ms':
                    break;
                break;
            }
            return convertedTime;
        },
        restartInterval: function(){

        },
        pauseInterval: function(){

        }
    },
    showAnswer: function(){

    },
    nextQuestion: function(){

    },
    restartGame: function(){

    }
};
