Feature: User Authentication
  As a user
  I want to be able to register a new Online Scoreboard account
  So that I can login to the app

Scenario: Navigate to homepage
  When I navigate to the Online Scoreboard homepage
  Then I should be on the Online Scoreboard homepage

Scenario: Login form
  Given I am on the Online Scoreboard homepage
  When I navigate to 'Login' page
  Then I should see 'Login' page
   And I should see login form

Scenario: Registration form
  Given I am on the Online Scoreboard login form
  When I navigate to 'Registration' page
  Then I should see 'Registration' page
   And I should see registration form
