@profile
Feature: Profile
  As an Online Scoreboard user
  I want to be able to change my username and avatar

  Scenario: Profile Page
    Given I am logged in
    When I navigate to '/profile'
    Then I should see the Profile page
    And The page should contain a 'username' form
    And The page should contain a 'avatar' form

  Scenario: Change Username
    Given I am logged in
    And I navigate to '/profile'
    When I change my username
    And I navigate to '/home'
    Then I should see my new username
