const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

exports.graphqlHandler = (event, context, callback) => {
  switch (event.field) {
    case 'shuffleAvatar': {
      const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
      callback(null, { avatar: randomName });
      break;
    }

    default: {
      callback(`Unknown field, unable to resolve ${event.field}`, null);
      break;
    }
  }
};
