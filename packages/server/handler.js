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
  switch (event.field) {
    case 'shuffleAvatar': {
      const randomName = uniqueNamesGenerator(randomNameConfig);
      callback(null, { avatar: randomName });
      break;
    }

    case 'generateGameName': {
      const randomName = await generateUniqueName(TABLE_NAME);

      if (randomName) {
        callback(null, { id: randomName });
      } else {
        callback('Cannot find an available game name');
      }

      break;
    }

    default: {
      callback(`Unknown field, unable to resolve ${event.field}`, null);
      break;
    }
  }
};
