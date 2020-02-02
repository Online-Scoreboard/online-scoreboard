Feature: New Game
  As an Online Scoreboard user
  I should be able to create a new game

@newGame
Scenario: Game Name step
  Given I am a logged in Online Scoreboard user
  When I navigate to '/new-game'
  Then I should see the New Game page
  And The new game page should contain a 'Game Name' form
  And The 'prev' button should be 'disabled'
  And The 'next' button should be 'disabled'

@newGame
Scenario: Game Name too short
  Given I am a logged in Online Scoreboard user
  And I navigate to '/new-game'
  When I enter 'game' as a game name
  Then I should see a 'error' message saying 'Minimum name of 6 characters. You must enter at least 2 more characters'
  And The 'next' button should be 'disabled'

@newGame
Scenario: Game Name too long
  Given I am a logged in Online Scoreboard user
  And I navigate to '/new-game'
  When I enter 'oh my! the new game is too long' as a game name
  Then I should see a 'error' message saying 'Ops! That name is too long. A maximum of 30 characters is allowed'
  And The 'next' button should be 'disabled'

@newGame
Scenario: Bad word in Game Name
  Given I am a logged in Online Scoreboard user
  And I navigate to '/new-game'
  When I enter 'shit this game' as a game name
  Then I should see a 'error' message saying 'Ops! Bad words are not allowed in here. Please check your game name'
  And The 'next' button should be 'disabled'

@newGame
Scenario: Valid Game Name
  Given I am a logged in Online Scoreboard user
  And I navigate to '/new-game'
  When I enter 'my new game' as a game name
  Then I should see a 'info' message saying 'Your game name looks amazing!'
  And The 'next' button should be 'enabled'
