@login
Feature: Login
  As a user
  I want to be able to log in to my Online Scoreboard credentials
  So that I can use and interact with the app

  Scenario: Login with wrong credentials
    Given I am on the login page
    When I enter 'wrong' login credentials
    Then I should see a 'error' notification saying 'User does not exist.'
    And I should see login form

  Scenario: Login with correct credentials
    Given I am on the login page
    When I enter 'correct' login credentials
    Then I should see the user dashboard
    And I should see a 'success' notification saying 'Welcome back!'
    And I should see the user dashboard
