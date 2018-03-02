var game = {
    info: 'This trivia game features known facts about some of the most popular and classic operas in the world. Are you ready to test your knowledge?',
    currentQnA:{},
    score: {
        correct:0,
        incorrect:0,
        unanswered:0
    },
    groups: [
        {
            question: 'Who\'s the gypsy who seduces a guard in order to escape imprisonment?',
            answer: 'Carmen',
            choices: ['Aida', 'Otello']
        },
        {
            question: 'Which character is similar in personality to that of The Hunchback of Notre Dame?',
            answer: 'Rigeletto',
            choices: ['L\'Orfeo', 'Pagliacci']
        },
        {
            question: 'Which opera features the song Figaro!',
            answer: 'The Barber of Seville',
            choices: ['Falstaff', 'Don Carlos']
        },
        {
            question: 'In which opera does all of the main characters die n a tale of revenge and betrayal, with the last act ending in suicide?',
            answer: 'Tosca',
            choices: ['Falstaff', 'Dido and Aeneas']
        },
        {
            question: 'Which opera takes place in early 1800s, Russia?',
            answer: 'Eugene Onegin',
            choices: ['Tristan and Isolde', 'Salome']
        },
        {
            question: 'Which is a comedy by Mozard?',
            answer: 'The Marriage of Figaro',
            choices: ['Idomeneo', 'Wozzeck']
        },
        {
            question: 'Dummy Question 7',
            answer: 'Norma',
            choices: ['Boris Godunov', 'William Tell']
        },
        {
            question: 'Which opera\'s famous aria is known as Musetta\'s Waltz?',
            answer: 'La bohème',
            choices: ['Der Rosenkavalier', 'Cavalleria Rusticana']
        },
        {
            question: 'Which is written as part of four operas with mystic heroes, and is 5 hours long?',
            answer: 'The Ring of Nibelung',
            choices: ['Orfeo ed Euridice', 'The Flying Dutchman']
        },
        {
            question: 'Which features the most famous opera melodies of all time, Brindisi?',
            answer: 'La Traviata',
            choices: ['The Tales of Hoffmann', 'The Queen of Spades']
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
    $('#start_panel .description').first().text(game.info);
    $('#start_panel button').first().on('click', game.startGame.bind(game));
    $('#end_panel button').first().on('click', game.resetGame.bind(game));
});
