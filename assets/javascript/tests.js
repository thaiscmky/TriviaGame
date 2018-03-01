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
            compare = $('div#timer').text() !== '00:00';
            assert("Timer should display 0:00", compare);
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

    console.warn('Initial Form Rendering Assertions');
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

    compare = $('input[name^="question"]').length >= 3;
    assert("There should be at least 3 choices in a question", compare);

    compare = !$('#question_panel .selections label').is(':empty');
    assert("None of the answer labels should be empty", compare);

    compare = !$('#answer_panel').is(":visible");
    assert('Answer panel should not be visible to end user.', compare);
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
    if(compare){
        compare = $('#timer').text() <= '00:05';
        assert('The current timer should be counting from 5 seconds', compare);
        if(compare){
            assertionTimer = setTimeout(testNextQuestion.bind(answer), game.timer.answerInterval * 1000 + 1);
        }
    }

    compare = $('legend.response').text().match('^Correct') || $('legend.response').text().match('^Incorrect');
    assert('User is told he has select either an incorrect or a correct answer.', compare, true);

    compare = !($('#gamequestion').is(':empty') && $('#gamequestion').text() === game.currentQnA.question);
    assert('The previous question should be displayed back to the user, and should match the question that corresponds to the answer.', compare);

    compare = !($('#useranswer').is(':empty') && $('#gameanswer').is(':empty'));
    assert('Either or both user selection and correct answer is displayed back to the user.', compare);

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

    compare = $('#question_panel .selections input').first().val() === $('#question_panel .selections label').first().text();
    assert('The new selection texts/labels are displayed to the end user.', compare);

    compare = $('#question_panel .selections input').is(':checked').length === 0;
    assert('The newly rendered answer selections are unchecked', compare);

    compare = $('div#timer').text() !== '00:00';
    assert("A new timer has started", compare);

    clearTimeout(assertionTimer);

}

function runtests(){
    var game = window['game'];
    testUiRendering();
    //event handlers
    $('#timer').bind('DOMSubtreeModified',function(){
        testTimerFunction(this)});
    $('input[name^="question"]').on('click',function(e){
        testUserSelection(e.target);
    });
}

$(document).ready(function() {
    console.warn('Running Tests');
    console.warn('To stop tests from running, remove the tests.js script call from the html page.');
    runtests();
});