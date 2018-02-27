var game = {
    currentQnA:{},
    totalQnA: 0,
    score: {
        correct:0,
        incorrect:0,
        unanswered:0
    },
    groups: [
        {
            question: 'Dummy Question',
            answer: 'The correct answer',
            choices: ['Wrong answer 1', 'Wrong answer 2']
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
            game.renderUi.displayTime(this.currentTime);
            if(this.currentTime === 0){
                this.pauseInterval();
            }
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
            game.renderUi.displayTime(this.currentTime);
            this.currentInterval = setInterval(
                game.timer.countDown.bind(this), this.convertTime(1, 'sec2ms'));
        },
        restartInterval: function(){
            this.timer.pauseInterval();
            this.currentTime = this.countFrom;
            game.renderUi.displayTime(this.currentTime);
            this.startInterval();

        },
        pauseInterval: function(){
            clearInterval(this.currentInterval);
        }
    },
    validateAnswer: function(selection){
        var userAnswer = $(selection).val();
        if($.inArray(userAnswer, game.choices) && userAnswer === game.currentQnA.answer){
            alert( 'Correct!');
            game.score.correct += 1;
        } else {
            alert( 'Incorrect!');
            game.score.incorrect += 1;
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
        this.totalQnA = this.groups.length;
        this.currentQnA = this.groups[0];
        this.renderUi.displayChoices(this.currentQnA);
        this.renderUi.displayAnswer();
        this.timer.startInterval();
    },
    renderUi: {
        displayChoices: function(qa){
            $('legend.question').text(qa.question);
            var choices = $.merge([qa.answer],qa.choices);
            game.utilities.shuffleArray(choices);
            $.each(choices, function(i, choice){
                var selectors = '#selections input#a'+(i+1);
                $(selectors).val(choice);
                $('label[for="a'+(i+1)+'"]').text($(selectors).val());
            });
        },
        displayAnswer: function(){

        },
        displayTime: function(t){
            $('#timer').css('visibility','visible');
            $('#timer').text('00:'+ (t < 10? '0' + t : t));
        }
    },
    utilities: {
        shuffleArray: function(arr){
            var shuffleVal = arr.length * 0.1;
            return arr.sort(function(){ return shuffleVal - Math.random() });
        }
    }
};

$(document).ready(function() {
    game.startGame();
    $('input[name^="question"]').on('click', function(e){
        game.validateAnswer(e.target);
    });;
});
