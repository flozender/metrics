require('dotenv').config();

const kafka = require('../../lib/kafka-client');
const elasticsearch = require('../../lib/elasticsearch-client');

const ELASTIC_SEARCH_INDEX = 'engagement';
const KAFKA_TOPIC = 'engagement-tracked';

// Create elasticsearch index
(async () => {
  try {
    await elasticsearch.createIndex(ELASTIC_SEARCH_INDEX);
  } catch(exception){
    if (JSON.parse(exception.response).error.type === 'resource_already_exists_exception'){
      console.log(`Index ${ELASTIC_SEARCH_INDEX} already exists`);
    } else {
      console.log("Exception while creating index: " + exception);
    }
  }
})();

// Subscribe to the Kafka topic
kafka.subscribe(KAFKA_TOPIC, async (message) => {
  console.log(`Analyzing engagement for "${message.value}"`);
  // Index data to Elasticsearch
  await elasticsearch.index(ELASTIC_SEARCH_INDEX, JSON.parse(message.value));
});

// Gracefully handle process termination
process.on('SIGTERM', () => {
  kafka.unsubscribe(KAFKA_TOPIC);
  process.exit(0);
});