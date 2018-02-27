/***
 * Documentation available at https://console.spec.whatwg.org/
 */
//console.clear();
function assert(assertion, condition, success, error){
    console.log(assertion);
    if(condition)
        console.log(typeof success === 'undefined' ? condition : success);
    else
        console.assert(typeof error === 'undefined' ? condition : error);
}

function testAnswerSelection(selection){
    assert("The current Q&A pair should be the first question in the game.groups array of objects.");
    compare = $.inArray( selection.val(), game.choices);
    assert('User selection should exist', compare);
}

function testTimerFunction(el){
    var compare;
    if(game.timer.currentTime < 0){
        compare = game.timer.currentTime === 0;
        assert("Timer should stop at 0", compare);
        clearInterval(game.timer.currentInterval);
        console.log('The timer should have stopped running');
        $(el).unbind('DOMSubtreeModified');
    };
}

function testUiRendering(){
    var compare = $('fieldset legend').hasClass('question');
    assert("The fieldset for rendering questions should have a legend with the class name of 'questions'", compare);
    compare = typeof $('div#timer') !== 'undefined';
    assert("A div of #timer to hold the question countdown should exist", compare);
    compare = $('div#timer').text() !== '00:00';
    assert("The displayed starting time should be greater than zero", compare);
    compare = $('div#timer').text() === '00:30';
    assert("The displayed starting countdown time should be 0:30", compare);
    compare = game.timer.currentInterval > 0;
    assert("A time interval should be active", compare);
    compare = $('#selections input[value=""]').length === 0;
    assert("None of the answer options should be empty", compare);
    compare = $('input[name^="question"]').length >= 3;
    assert("There should be at least 3 choices in a question", compare);
    compare = !$('#selections label').is(':empty');
    assert("None of the answer labels should be empty", compare);
}
function testUserSelection(selection){
    var answer = $(selection).val();
    var compare;
    compare = answer.match('^Wrong Answer');
}

function runtests(){
    var game = window['game'];
    testUiRendering();
    //event handlers
    $('#timer').bind('DOMSubtreeModified',function(){
        testTimerFunction(this)});
    $('input[name^="question"]').on('click',function(){
        testUserSelection(this);
    });
}

$(document).ready(function() {
    console.warn('Running Tests');
    console.warn('To stop tests from running, remove the tests.js script call from the html page.');
    runtests();
});