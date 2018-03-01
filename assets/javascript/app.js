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
            question: 'Dummy Question 1',
            answer: 'The correct answer',
            choices: ['Wrong answer 1', 'Wrong answer 2']
        },
        {
            question: 'Dummy Question 2',
            answer: 'The correct answer',
            choices: ['Wrong answer 1', 'Wrong answer 2']
        },
        {
            question: 'Dummy Question 3',
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
        startInterval: function(t){
            clearInterval(game.timer.currentInterval);
            this.currentTime = typeof t === 'undefined' ? this.countFrom : t;
            game.renderUi.displayTime(this.currentTime);
            game.timer.currentInterval = setInterval(
                game.timer.countDown.bind(this), this.convertTime(1, 'sec2ms'));
        },
        restartInterval: function(){
            this.timer.pauseInterval();
            this.currentTime = this.countFrom;
            game.renderUi.displayTime(this.currentTime);
            this.startInterval();

        },
        pauseInterval: function(){
            clearInterval(game.timer.currentInterval);
        }
    },
    validateAnswer: function(selection){
        var userAnswer = $(selection).val();
        if($.inArray(userAnswer, game.choices) && userAnswer === game.currentQnA.answer){
            this.score.correct += 1;
            this.renderUi.displayAnswer('Correct!', '<p>You selected:<br/> ' + userAnswer + '</p>');
        } else {
            this.score.incorrect += 1;
            this.renderUi.displayAnswer('Incorrect!', '<p>You selected:<br/> ' + userAnswer, '</p><p>The correct answer was:<br/>' + game.currentQnA.answer);
        }
    },
    nextQuestion: function(){

    },
    restartGame: function(){

    },
    startGame: function(){
        $('#start_panel').hide();
        $('#end_panel').hide();
        $('#answer_panel').hide();
        $('#question_panel').show();
        this.totalQnA = this.groups.length;
        this.currentQnA = this.groups[0];
        this.renderUi.displayChoices(this.currentQnA);
        this.timer.startInterval();
    },
    renderUi: {
        displayChoices: function(qa){
            $('#answer_panel').hide();
            $('#question_panel').show();
            $('legend.question').text(qa.question);
            var choices = $.merge([qa.answer],qa.choices);
            game.utilities.shuffleArray(choices);
            $.each(choices, function(i, choice){
                var selectors = '#question_panel .selections input#a'+(i+1);
                $(selectors).val(choice);
                $('label[for="a'+(i+1)+'"]').text($(selectors).val());
            });
        },
        displayAnswer: function(legend, msg1, msg2){
            $('#question_panel').hide();
            game.timer.startInterval(5);
            var $container = $('#answer_panel');
            $container.show();
            $container.find('legend.response').text(legend);
            $container.find('#useranswer').html( msg1 );
            $container.find('#gameanswer').html( typeof msg2 === 'undefined' ? '' : msg2 );

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
