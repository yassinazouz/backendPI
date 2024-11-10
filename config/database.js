const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'tipsandtrips';

async function connectToDatabase() {
    const client = await MongoClient.connect(url);
  return client.db(dbName);
}

module.exports = connectToDatabase;
