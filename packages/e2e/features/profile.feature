Feature: Profile
  As an Online Scoreboard user
  I want to be able to change my username and avatar

@profile
Scenario: Profile Page
  Given I am a logged in Online Scoreboard user
  When I navigate to '/profile'
  Then I should see the Profile page
  And The page should contain a 'username' form
  And The page should contain a 'avatar' form

@profile
Scenario: Change Username
  Given I am a logged in Online Scoreboard user
  And I navigate to '/profile'
  When I change my username
  And I navigate to '/home'
  Then I should see my new username
