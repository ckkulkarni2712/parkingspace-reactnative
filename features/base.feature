Feature: Base Component

    Scenario: User enters the number of spaces
        Given the user is on the home page
        When the user enters some input in the input field and submits
        And the parking lot should be initialized with 10 spaces
