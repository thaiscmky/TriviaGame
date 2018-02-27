# Use Cases

## Landing Page

---

User loads the application

## Questions

---

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

---

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

---

User arrives at score screen