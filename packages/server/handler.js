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
  const { field, owner } = event;

  switch (field) {
    case 'shuffleAvatar': {
      const randomName = uniqueNamesGenerator(randomNameConfig);
      callback(null, { avatar: randomName });
      break;
    }

    case 'createGame': {
      const isValid = true;
      const randomName = await generateUniqueName(TABLE_NAME);
      const createdAt = new Date().toISOString();
      const values = {
        owner,
        createdAt,
        __typename: 'Game',
        status: 'new',
        users: [owner],
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
      const pendingPlayers = (gameDataItem && gameDataItem.pendingPlayers) || [];
      const gameAuthor = gameDataItem && gameDataItem.owner;

      if (!~pendingPlayers.indexOf(userId) && gameAuthor !== userId) {
        pendingPlayers.push(userId);
      }

      const values = {
        pendingPlayers,
      };

      callback(null, { id: gameId, values, isValid });

      break;
    }

    case 'acceptPlayer': {
      const { input, userId } = event;
      const { gameId, playerId } = input;
      const gameData = await findItem(TABLE_NAME, gameId);
      const gameExists = doesItemExist(gameData);

      if (!gameExists) {
        callback(null, { error: `Game ${gameId} does not exist` });
      }

      const gameDataItem = gameData.Items[0];
      const pendingPlayers = (gameDataItem && gameDataItem.pendingPlayers) || [];
      const users = (gameDataItem && gameDataItem.users) || [];
      const isValid = Boolean(~gameDataItem.users.indexOf(userId));

      if (!~pendingPlayers.indexOf(playerId)) {
        callback(null, { error: `Cannot add ${playerId} to ${gameId}. The player needs to request to join first` });
      }

      const pendingPlayersUpdate = pendingPlayers.filter(item => item !== playerId);
      const usersUpdated = [...users, playerId];

      const values = {
        pendingPlayers: pendingPlayersUpdate,
        users: usersUpdated,
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
