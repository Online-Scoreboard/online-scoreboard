const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const AWS = require('aws-sdk');
const REGION = process.env.REGION || 'us-east-1';
const TABLE_NAME = process.env.TABLE_NAME || '';

AWS.config.update({
  region: REGION,
});

const docClient = new AWS.DynamoDB.DocumentClient();

const randomNameConfig = {
  dictionaries: [adjectives, colors, animals],
  length: 3,
  separator: '_',
  style: 'lowerCase',
};

const doesItemExist = data => {
  if (data && data.Items && data.Count && data.Count > 0 && data.Items.length && data.Items[0]) {
    return data.Items[0];
  }

  return undefined;
};

const findItem = async (tableName, itemId) => {
  const params = {
    TableName: tableName,
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': itemId,
    },
  };

  return docClient.query(params).promise();
};

const generateUniqueName = async tableName => {
  const randomName = async (fileName, iteration = 1) => {
    if (iteration > 3) {
      return null;
    }

    let itemData;
    try {
      itemData = await findItem(tableName, fileName);
    } catch (err) {
      console.log(err);
      return null;
    }

    if (doesItemExist(itemData)) {
      const newFileName = uniqueNamesGenerator(randomNameConfig);
      return randomName(newFileName, iteration + 1);
    }
    return fileName;
  };

  return randomName(uniqueNamesGenerator(randomNameConfig));
};

exports.graphqlHandler = async (event, context, callback) => {
  const { field, owner, input } = event;

  switch (field) {
    case 'shuffleAvatar': {
      const randomName = uniqueNamesGenerator(randomNameConfig);
      callback(null, { avatar: randomName });
      break;
    }

    case 'createGame': {
      const { rules, teams, teamColors, setup } = input;
      const pendingUsers = [];
      const isValid = Boolean(setup && setup.gameName, rules && teams && teamColors && teamColors.length);

      if (!isValid) {
        callback(null, { error: 'invalid game data' });
      }

      if (!rules.name) {
        rules.name = 'custom';
      }

      const randomName = await generateUniqueName(TABLE_NAME);
      const createdAt = new Date().toISOString();
      const values = {
        __typename: 'Game',
        status: 'new',
        name: setup.gameName,
        users: [owner],
        createdAt,
        owner,
        pendingUsers,
        teamColors,
        teams,
        rules,
      };
      if (randomName) {
        callback(null, { id: randomName, values, isValid });
      } else {
        callback(null, { error: 'Cannot find an available game name' });
      }

      break;
    }

    case 'startGame': {
      const { gameId, userId } = event;

      const values = {
        status: 'started',
      };
      const gameData = await findItem(TABLE_NAME, gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
      }

      const gameDataItem = gameData.Items[0];
      const isValid = Boolean(~gameDataItem.users.indexOf(userId));

      callback(null, { id: gameId, values, isValid });

      break;
    }

    case 'joinGame': {
      const { gameId, userId } = event;

      const gameData = await findItem(TABLE_NAME, gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
      }

      const isValid = true;
      const gameDataItem = gameData.Items[0];
      const pendingUsers = (gameDataItem && gameDataItem.pendingUsers) || [];
      const gameAuthor = gameDataItem && gameDataItem.owner;

      if (!~pendingUsers.indexOf(userId) && gameAuthor !== userId) {
        pendingUsers.push(userId);
      }

      const values = {
        pendingUsers,
      };

      callback(null, { id: gameId, values, isValid });

      break;
    }

    case 'acceptUser': {
      const { userId } = event;
      const { gameId, pendingUserId } = input;
      const gameData = await findItem(TABLE_NAME, gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
      }

      const gameDataItem = gameData.Items[0];
      const pendingUsers = (gameDataItem && gameDataItem.pendingUsers) || [];
      const users = (gameDataItem && gameDataItem.users) || [];
      const isValid = Boolean(~gameDataItem.users.indexOf(userId));

      if (!~pendingUsers.indexOf(pendingUserId)) {
        callback(null, { error: `Cannot add ${pendingUserId} to ${gameId}. The user needs to request to join first` });
      }

      const pendingUsersUpdate = pendingUsers.filter(item => item !== pendingUserId);
      const usersUpdated = [...users, pendingUserId];

      const values = {
        pendingUsers: pendingUsersUpdate,
        users: usersUpdated,
      };

      callback(null, { id: gameId, values, isValid });

      break;
    }

    case 'rejectUser': {
      const { userId } = event;
      const { gameId, pendingUserId } = input;
      const gameData = await findItem(TABLE_NAME, gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
      }

      const gameDataItem = gameData.Items[0];
      const pendingUsers = (gameDataItem && gameDataItem.pendingUsers) || [];
      const isValid = Boolean(~gameDataItem.users.indexOf(userId));

      if (!~pendingUsers.indexOf(pendingUserId)) {
        callback(null, {
          error: `Cannot find a pending user matching id ${pendingUserId} in ${gameId}. The user needs to request to join first`,
        });
      }

      const pendingUsersUpdate = pendingUsers.filter(item => item !== pendingUserId);

      const values = {
        pendingUsers: pendingUsersUpdate,
      };

      callback(null, { id: gameId, values, isValid });

      break;
    }

    default: {
      callback(null, { error: `Unknown field, unable to resolve ${event.field}` });
      break;
    }
  }
};
