@register
Feature: Register
  As a user
  I should be able to register a new Online Scoreboard account
  So that I can log in and start interacting with the app

  @createNewUser
  Scenario: Register with invalid password
    Given I am on the registration page
    When I fill in the registration form with 'valid' email address and 'invalid' password for user 'test1'
    Then I should see a 'error' notification saying "1 validation error detected: Value at 'password' failed to satisfy constraint: Member must have length greater than or equal to 6"
    And I should see the registration form

  Scenario: Register with invalid email address
    Given I am on the registration page
    When I fill in the registration form with 'invalid' email address and 'valid' password for user 'test2'
    Then I should see a 'error' notification saying 'Username should be an email.'
    And I should see the registration form

  Scenario: Register with existing email address
    Given I am on the registration page
    When I fill in the registration form with 'existing' email address and 'valid' password for user 'test2'
    Then I should see a 'error' notification saying 'An account with the given email already exists.'
    And I should see the registration form

  @createNewUser
  Scenario: Register with correct credentials
    Given I am on the registration page
    When I fill in the registration form with 'valid' email address and 'valid' password for user 'test3'
    And I should see the email verification form
    And The user 'test3' should receive an email containing the verification code
    And I should see login form
    And I enter 'test3' login credentials
    Then I should see the user dashboard
