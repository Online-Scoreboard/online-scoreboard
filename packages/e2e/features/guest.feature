@guest
Feature: Guest interactions
  As a guest
  I should be able to access the page, log in or register

  Scenario: Navigate to homepage
    When I navigate to the homepage
    Then I should be on the homepage

  Scenario: Login form
    Given I am on the homepage
    When I navigate to the Login page
    Then I should see the Login page
    And I should see login form

  Scenario: Registration form
    Given I am on the login page
    When I navigate to the Registration page
    Then I should see the Registration page
    And I should see the registration form
