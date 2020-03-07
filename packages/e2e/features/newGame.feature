Feature: New Game
  As an Online Scoreboard user
  I should be able to create a new game

  @newGame @gameName
  Scenario: Game Name step
    Given I am a logged in Online Scoreboard user
    When I navigate to '/new-game'
    Then I should see the New Game page
    And The new game page should contain a 'Game Name' form
    And The 'prev' button should be 'disabled'
    And The 'next' button should be 'disabled'

  @newGame @gameName
  Scenario: Game Name too short
    Given I am a logged in Online Scoreboard user
    And I navigate to '/new-game'
    When I enter 'game' as a game name
    Then I should see a 'error' message saying 'Minimum name of 6 characters. You must enter at least 2 more characters'
    And The 'next' button should be 'disabled'

  @newGame @gameName
  Scenario: Game Name too long
    Given I am a logged in Online Scoreboard user
    And I navigate to '/new-game'
    When I enter 'oh my! the new game is too long' as a game name
    Then I should see a 'error' message saying 'Ops! That name is too long. A maximum of 30 characters is allowed'
    And The 'next' button should be 'disabled'

  @newGame @gameName
  Scenario: Bad word in Game Name
    Given I am a logged in Online Scoreboard user
    And I navigate to '/new-game'
    When I enter 'shit this game' as a game name
    Then I should see a 'error' message saying 'Ops! Bad words are not allowed in here. Please check your game name'
    And The 'next' button should be 'disabled'

  @newGame @gameName
  Scenario: Valid Game Name
    Given I am a logged in Online Scoreboard user
    And I navigate to '/new-game'
    When I enter 'my new game' as a game name
    Then I should see a 'info' message saying 'Your game name looks amazing!'
    And The 'next' button should be 'enabled'

  @newGame @gameRules
  Scenario: Game Rules step
    Given I am a logged in Online Scoreboard user
    When I navigate to '/new-game'
    And I complete the 'Game Name' step
    Then The new game page should contain a 'Game Rules' form
    And I should see a Predefined game Rules field
    And The selected predefined game Rule should be 'Chess'
    And The 'prev' button should be 'enabled'
    And The 'next' button should be 'enabled'

  @newGame @gameRules
  Scenario: Game predefined Rules
    Given I am a logged in Online Scoreboard user
    And I navigate to '/new-game'
    And I complete the 'Game Name' step
    When I click on the Predefined game Rules
    Then I should see a list of predefined game Rules

  @newGame @gameRules
  Scenario: Game custom Rules
    Given I am a logged in Online Scoreboard user
    And I navigate to '/new-game'
    And I complete the 'Game Name' step
    And I expand the Advanced Rules
    And I should see a list of Advanced game Rules
    When I interact with the custom game Rules
    Then The selected predefined game Rule should be ''
    And The 'next' button should be 'enabled'

  @newGame @gameRules
  Scenario: Game with invalid custom Rules
    Given I am a logged in Online Scoreboard user
    And I navigate to '/new-game'
    And I complete the 'Game Name' step
    And I expand the Advanced Rules
    And I should see a list of Advanced game Rules
    When I enter some invalid game Rules
    Then I should see a 'error' message saying 'You cannot set a winning score equal to the staring one'
    And The 'next' button should be 'disabled'

  @newGame @gameTeams
  Scenario: Teams step
    Given I am a logged in Online Scoreboard user
    When I navigate to '/new-game'
    And I complete the 'Game Name' step
    And I complete the 'Game Rules' step
    Then The new game page should contain a 'Teams' form
    And The predefined team size should be '2'
    And The 'prev' button should be 'enabled'
    And The 'next' button should be 'enabled'
    And I should see a 'info' message saying 'You're all set to start a 2 teams game!'

  @newGame @gameTeams
  Scenario: Team size invalid because below minimum
    Given I am a logged in Online Scoreboard user
    And I navigate to '/new-game'
    And I complete the 'Game Name' step
    And I complete the 'Game Rules' step
    When I set the team size to '1'
    Then I should see a 'error' message saying 'You must choose 2 teams according to your game rules'
    And The 'prev' button should be 'enabled'
    And The 'next' button should be 'disabled'

  @newGame @gameTeams
  Scenario: Team size invalid because above maximum
    Given I am a logged in Online Scoreboard user
    And I navigate to '/new-game'
    And I complete the 'Game Name' step
    And I complete the 'Game Rules' step
    When I set the team size to '3'
    Then I should see a 'error' message saying 'You must choose 2 teams according to your game rules'
    And The 'prev' button should be 'enabled'
    And The 'next' button should be 'disabled'

  @newGame @teamColors
  Scenario: Team Colors step
    Given I am a logged in Online Scoreboard user
    And I navigate to '/new-game'
    And I complete the 'Game Name' step
    And I complete the 'Game Rules' step
    And I complete the 'Team Size' step
    Then The new game page should contain a 'Team Colors' form
    And The team color 'black' should be selected
    And The 'prev' button should be 'enabled'
    And The 'next' button should be 'disabled'
    And I should see a 'error' message saying 'You must select 1 more color'
