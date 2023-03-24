Feature: Payment Screen

    Scenario: User pays for occupied parking spot
        Given I am on the Payment Screen
        And I see the vehicle registration and hours parked for the occupied parking spot
        And I see the parking charge for the occupied parking spot
        When I click on the Make Payment button
        And the payment is successfully processed
        Then I see an alert indicating that the payment was successful
        And the occupied parking spot is marked as unoccupied

