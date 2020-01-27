Feature: Profile
  As an Online Scoreboard user
  I want to be able to change my username and avatar

@profile
Scenario: Profile Page
  Given I am a logged in Online Scoreboard user
  When I navigate to the Profile page
  When I should see the Profile page
  And The page should contain a 'username' form
  And The page should contain a 'avatar' form
