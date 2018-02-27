
var game = {
    currentQnA:{},
    totalQnA: this.groups.length,
    score: {
        correct:0,
        incorrect:0,
        unanswered:0
    },
    groups: [
        {
            question: 'Dummy Question',
            answer: 'The correct answer',
            choices: {
                correct: [this.answer],
                incorrect: ['Wrong answer 1', 'Wrong answer 2']
            }
        }
    ],
    timer: {
        countFrom: 30,
        countTo: 0,
        currentInterval: 0,
        currentTime: 0,
        answerInterval: 5,
        countDown: function(){
            this.currentTime--;
            this.displayTime(this.currentTime);
            if(this.currentTime === 0)
                clearInterval(this.currentInterval);
        },
        convertTime: function(t, type){
            var convertedTime;
            switch(type){
                case 'ms2sec':
                    convertedTime = t / 1000;
                    break;
                case 'sec2ms':
                    convertedTime = t * 1000;
                    break;
            }
            return convertedTime;
        },
        startInterval: function(){
            this.currentTime = this.countFrom;
            renderUi.displayTime(this.currentTime);
            clearInterval(this.currentInterval);
            this.currentInterval = setInterval(
                game.timer.countDown.bind(this), this.convertTime(1, 'sec2ms'));
        },
        restartInterval: function(){

        },
        pauseInterval: function(){
            clearInterval(this.currentInterval);
        }
    },
    showAnswer: function(){
        this.timer.pauseInterval();
    },
    nextQuestion: function(){

    },
    restartGame: function(){

    },
    startGame: function(){
        this.currentQnA = this.groups[0];
        this.renderUi.displayChoices(this.currentQnA);
        this.renderUi.displayAnswer();
        this.timer.startInterval();
    },
    renderUi: {
        displayChoices: function(qa){
            $('legend.question').text(qa.question);
            var choices = $.merge(
                $.merge([], qa.choices.correct),
                qa.choices.incorrect
            );
            this.utilities.shuffleArray(choices);
            $.each(choices, function(choice){

            });
        },
        displayAnswer: function(){

        },
        displayTime: function(t){
            $('#timer').css('visibility','visible');
            $('#timer').text('00:'+ (t < 10? '0' + t : t));
        },
    },
    utilities: {
        shuffleArray: function(arr){
            var shuffleVal = arr.length * 0.1;
            return arr.sort(function(){ return shuffleVal - Math.random() });
        }
    }
};

$(document).ready(function() {
    $('input[name^="question"]').on('click', function(){
        
    });
});
