Feature: Login
  As a user
  I want to be able to log in to my Online Scoreboard account
  So that I can use the app

@login
Scenario: Login with wrong credentials
  Given I am on the Online Scoreboard login form
  When I enter 'wrong' login credentials
  Then I should see a 'error' notification saying 'User does not exist.'
   And I should see login form

@login
Scenario: Login with correct credentials
  Given I am on the Online Scoreboard login form
  When I enter 'correct' login credentials
  Then I should see a 'success' notification saying 'Welcome back!'
   And I should see the user dashboard
