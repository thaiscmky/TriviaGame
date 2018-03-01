# Use Cases

## Landing Page

User loads the application
+ User is provided a description of the game
+ User is provided with a choice to start the game
+ __Scenario 1__: User selects call to action to start the game
    - User is forwarded to the first question

## Questions

User arrives at question screen

+ __Scenario 1__: User selects an answer within the time allowed
    - User is forwarded to a screen
        - without visible selectable choices,
        - with the answer selected displayed, 
        - and with the "correct" answer displayed
+ __Scenario 2__: User does not select an answer within the time allowed
    - User is forwarded to a screen
            - without visible selectable choices, 
            - with the "correct" answer displayed

## Answers

User arrives at answer screen

+ __Scenario 1__: Choice provided at question screen does not match the correct answer
    - User is provided with the correct answer
    - User is told what his choice was, and that it was the incorrect choice
    - User is automatically forwarded to the next question within a few seconds
+ __Scenario 2__: Choice provided at question screen matches the correct answer
    - User is provided with the correct answer
    - User is told what his choice was the correct choice
    - User is automatically forwarded to the next question within a few seconds
+ __Scenario 3__: Choice provided at question screen is for the last question/answer pair
    - _Scenario 2_ or _Scenario 3_ occurs
    -  __Instead of__ being forwarded to a next question
        - User is provided with a tally screen/end of game screen

## End of Game

User arrives at score screen

+ The timer is set to 0
+ User is shown how many answers through the game he selected wrong
+ User is shown how many answers through the game he selected right
+ User is shown how many answers through the game he left unanswered
+ The answers and question choices are not visible
+ User is given a choice to start the game again
+ __Scenario 1__: User chooses to restart game
    - The answers score is reset to zero
    - The unanswered score is set to zero
    - The timer is set to the time allowed per answer
    - The first question is displayed