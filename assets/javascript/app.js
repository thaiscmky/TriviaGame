var game = {
    currentQnA:{},
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
        },
        {
            question: 'Dummy Question 4',
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
            if(this.currentTime === -1){
                this.pauseInterval();
                game.score.unanswered += 1;
                game.renderUi.displayAnswer('Time\'s up!',
                    '<p><strong>Question: </strong>: ' + game.currentQnA.question + '</p>',
                    '<p><strong>Answer: </strong>' + game.currentQnA.answer + '</p>',
                    '');
                game.timer.nextQuestionDelay = setTimeout(game.goToNextQuestion.bind(game), this.convertTime(this.answerInterval, 'sec2ms'));
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
        var userAnswer = $(selection).text();
        var question = '<p><strong>Question: </strong>: ' + game.currentQnA.question + '</p>';
        if($.inArray(userAnswer, game.choices) && userAnswer === game.currentQnA.answer){
            this.score.correct += 1;
            this.renderUi.displayAnswer(
                'That\'s Correct!',
                question,
                '<p><strong>Answer:</strong>' + userAnswer + '</p>');
        } else {
            this.score.incorrect += 1;
            this.renderUi.displayAnswer(
                'That\'s Incorrect',
                question,
                '<p><strong>Answer: </strong>' + game.currentQnA.answer + '</p><p><strong>You selected: </strong> ' + userAnswer + '</p>');
        }
        game.timer.nextQuestionDelay = setTimeout(this.goToNextQuestion.bind(this), this.timer.convertTime(this.timer.answerInterval, 'sec2ms'));
    },
    goToNextQuestion: function(){
        var next = game.score.correct + game.score.incorrect + game.score.unanswered;
        if(next < this.groups.length){
            this.timer.startInterval(this.timer.countFrom);
            game.currentQnA = this.groups[next];
            this.renderUi.displayChoices(this.currentQnA);
        }
        else {
            this.timer.pauseInterval();
            this.endGame();
        }
        clearTimeout(game.timer.nextQuestionDelay);
    },
    startGame: function(){
        $('#start_panel').hide();
        $('#end_panel').hide();
        $('#answer_panel').hide();
        $('#question_panel').show();
        this.currentQnA = this.groups[0];
        this.renderUi.displayChoices(this.currentQnA);
        this.timer.startInterval();

        $('#question_panel .selections label[for^="a"]').on('click', function(e){
            game.validateAnswer(e.target);
        });
    },
    endGame: function() {
        $('#start_panel').hide();
        $('#question_panel').hide();
        $('#answer_panel').hide();
        $('#end_panel .description').first().empty();
        $('#end_panel').show();
        $('#end_panel legend#end').text('You\'ve reached the end. Let\'s well you Trivia\'d!');
        var $description = $('#end_panel .description').first();
        var correct = '<p><strong>Correct: </strong> ' + game.score.correct + '</p>';
        var incorrect = '<p><strong>Incorrect: </strong> ' + game.score.incorrect + '</p>';
        var unanswered = '<p><strong>Unanswered: </strong> ' + game.score.unanswered + '</p>';
        $description.append(correct + incorrect + unanswered);
        this.renderUi.displayTime(0);
    },
    resetGame: function() {
        this.score.correct = 0;
        this.score.incorrect = 0;
        this.score.unanswered = 0;
        this.startGame();
    },
    renderUi: {
        displayChoices: function(qa){
            $('#answer_panel').hide();
            $('#question_panel').show();
            $('legend.question').text(qa.question);
            var choices = $.merge([qa.answer],qa.choices);
            var question = $.inArray(qa, game.groups) + 1;
            game.utilities.shuffleArray(choices);
            $('#question_panel .selections').first().attr('id', 'question'+question);
            var selections = $('#question_panel .selections .form-check input');
            var labels = $('#question_panel .selections .form-check label');
            $.each(choices, function(i, choice){
                $(selections[i]).attr('value', choice);
                $(selections[i]).attr('name','question'+(question));
                $(labels[i]).attr('for', 'a'+(i+1));
                $(labels[i]).find('span').first().text($(selections[i]).val());
            });
        },
        displayAnswer: function(legend, question, msg1, msg2){
            $('#question_panel').hide();
            game.timer.startInterval(game.timer.answerInterval);
            var $container = $('#answer_panel');
            $container.show();
            $container.find('legend.response').text(legend);
            $container.find('#gamequestion').html(question);
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
    $('#start_panel button').first().on('click', game.startGame.bind(game));
    $('#end_panel button').first().on('click', game.resetGame.bind(game));
});
