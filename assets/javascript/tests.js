/***
 * Documentation available at https://console.spec.whatwg.org/
 */
//console.clear();
var assertionTimer;

function assert(assertion, condition, success, error){
    console.log(assertion);
    if(condition)
        console.log(typeof success === 'undefined' ? condition : success);
    else
        console.assert(typeof error === 'undefined' ? condition : error);
}

function testTimerFunction(el){
    var compare;
    switch(t = game.timer.currentTime) {
        case t === -1:
            compare = game.timer.currentTime === -1;
            console.error('Timer did not stop at -1');
            compare = $('div#timer').text() === '00:00';
            assert("Timer should display 00:00", compare);
            $(el).unbind('DOMSubtreeModified');
            break;
        case t < 0:
            clearInterval(game.timer.currentInterval);
            console.error('The timer did not stop running');
            $(el).unbind('DOMSubtreeModified');
            break;
    }
}

function testUiRendering(){
    console.warn('Initial Screen Rendering Assertions');
    var compare;

    compare = $('#start_panel').is(':visible') && $('#start_panel button').length > 0;
    assert("There a choice to start the game", compare);
    compare = !($('#question_panel').is(':visible') || $('#answer_panel').is(':visible'));
    assert("There should be no answers or questions on the screen", compare);
    compare = !$('#end_panel').is(':visible');
    assert("There should not be a choice to restart the game", compare);
    compare = $('#start_panel .description').first().is(':visible') && !$('#start_panel .description').first().is(':empty');
    assert("The game description should be visible and not empty", compare);

}
function testQuestionRendering(){

    console.warn('Initial Question Rendering Assertions');
    var compare;

    compare = $('fieldset legend').hasClass('question');
    assert("The fieldset for rendering questions should have a legend with the class name of 'questions'", compare);

    compare = typeof $('div#timer') !== 'undefined';
    assert("A div of #timer to hold the question countdown should exist", compare);

    compare = $('div#timer').text() !== '00:00';
    assert("The displayed starting time should be greater than zero", compare);

    compare = $('div#timer').text() === '00:30';
    assert("The displayed starting countdown time should be 0:30", compare);

    compare = game.timer.currentInterval > 0;
    assert("A time interval should be active", compare);

    compare = $('#question_panel .selections input[value=""]').length === 0;
    assert("None of the answer options should be empty", compare);

    compare = $('#question_panel .selections label[for^="a"]').length >= 3;
    assert("There should be at least 3 choices in a question", compare);

    compare = !$('#question_panel .selections label').is(':empty');
    assert("None of the answer labels should be empty", compare);

    compare = !$('#answer_panel').is(":visible");
    assert('Answer panel should not be visible to end user.', compare);

    $('#question_panel .selections label[for^="a"]').on('click',function(e){
        testUserSelection(e.target);
    });
}
function testUserSelection(selection){

    console.warn('User Selection Assertions');
    var answer = $(selection).val();
    var compare;

    compare = (game.score.incorrect > 0 || game.score.correct > 0);
    assert('Number of correct or incorrect answers increase when user makes a selection.', compare);

    testAnswerSelection(answer);
}

function testAnswerSelection(answer){

    console.warn('Answer Selection assertions');
    var compare;

    compare = !$('#question_panel').is(":visible");
    assert('Question panel is no longer visible to end user.', compare);

    compare = $('#answer_panel').is(":visible");
    assert('Answer panel is now visible to end user.', compare);

    compare = $('legend.response').text().match('orrect') || $('legend.response').text().match('ncorrect');
    assert('User is told he has select either an incorrect or a correct answer.', compare, true);

    compare = !($('#gamequestion').is(':empty') && $('#gamequestion').text() === game.currentQnA.question);
    assert('The previous question should be displayed back to the user, and should match the question that corresponds to the answer.', compare);

    compare = !($('#useranswer').is(':empty') && $('#gameanswer').is(':empty'));
    assert('Either or both user selection and correct answer is displayed back to the user.', compare);

    if(compare){
        compare = $('#timer').text() <= '00:05';
        assert('The current timer should be counting from 5 seconds', compare);
        if(compare){
            if(game.currentQnA === game.groups[game.groups.length -1])
                testEndGameRendering();
            else
                assertionTimer = setTimeout(testNextQuestion.bind(answer), game.timer.answerInterval * 1000 + 1);
        }
    }

}

function testNextQuestion(){
    console.warn('Next question assertions');
    var compare;
    var nextQuestionIndex = game.score.correct + game.score.incorrect + game.score.unanswered;

    compare = nextQuestionIndex ===  $.inArray(game.currentQnA, game.groups)
        && $.inArray( game.currentQnA, game.groups) !== -1;
    assert('A the next question/answer pair is selected.', compare);

    compare = $('#question_panel').is(":visible");
    assert('Question panel is now visible to end user.', compare);

    compare = !$('#answer_panel').is(":visible");
    assert('Answer panel is no longer visible to end user.', compare);

    compare = $('fieldset legend.question').text() === game.currentQnA.question
        && $('fieldset legend.question').text() === game.groups[nextQuestionIndex].question;
    assert ('A new question is displayed to the end user.', compare);

    compare = $('#question_panel .selections input').filter(function(i, el){
        return !$.inArray($(el).val(), game.groups[nextQuestionIndex].choices);
    }).length > 0;
    assert('The new selection options are displayed to the end user.', compare);

    compare = $('#question_panel .selections label[for^="a"]').filter(function(i, el){
            return !$.inArray($(el).text(), game.groups[nextQuestionIndex].choices);
        }).length > 0;
    assert('The new selection texts/labels are displayed to the end user.', compare);

    compare = $('#question_panel .selections input').is(':checked').length === 0;
    assert('The newly rendered answer selections are unchecked', compare);

    compare = $('div#timer').text() !== '00:00';
    assert("A new timer has started", compare);

    clearTimeout(assertionTimer);

}

function testEndGameRendering() {
    console.log('This is the last question/answer pair in the trivia.');
    $('#timer').bind('DOMSubtreeModified',function(){
        if(game.timer.currentTime === 0){
            console.warn('Running Last Screen Tests.');
            $('#timer').unbind('DOMSubtreeModified');

            var compare;

            compare = !$('#question_panel').is(":visible");
            assert('Question panel is not visible to end user.', compare);

            compare = !$('#answer_panel').is(":visible");
            assert('Answer panel is no longer visible to end user.', compare);

            compare = $('#end_panel').is(":visible");
            assert('The endgame panel is now visible to end user.', compare);

            compare = $('#end_panel .description').text().match('orrect') &&
                $('#end_panel .description').text().match(game.score.correct);
            assert('The endgame panel shows the user\'s number of correct answers.', compare);

            compare = $('#end_panel .description').text().match('ncorrect') &&
                $('#end_panel .description').text().match(game.score.incorrect);
            assert('The endgame panel shows the user\'s number of incorrect answers.', compare);

            compare = $('#end_panel .description').text().match('nanswered') &&
                $('#end_panel .description').text().match(game.score.unanswered);
            assert('The endgame panel shows the user\'s number of unanswered questions.', compare);
        }
    });

}

function runtests(){
    var game = window['game'];
    testUiRendering();
    //event handlers
    $('#timer').bind('DOMSubtreeModified',function(){
        testTimerFunction(this)});
    $('#start_panel button').first().on('click', testQuestionRendering);
    $('#end_panel button').first().on('click', testQuestionRendering);
}
$(document).ready(function() {
    console.warn('Running Tests');
    console.warn('To stop tests from running, remove the tests.js script call from the html page.');
    runtests();
});