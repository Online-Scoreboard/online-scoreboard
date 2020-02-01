Feature: User Authentication
  As a user
  I should be able to register a new Online Scoreboard account
  So that I can log in and interact with the app

Scenario: Navigate to homepage
  When I navigate to the Online Scoreboard homepage
  Then I should be on the Online Scoreboard homepage

Scenario: Login form
  Given I am on the Online Scoreboard homepage
  When I navigate to the Login page
  Then I should see the Login page
  And I should see login form

Scenario: Registration form
  Given I am on the Online Scoreboard login form
  When I navigate to the Registration page
  Then I should see the Registration page
  And I should see the registration form
