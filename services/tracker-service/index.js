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
  console.log(`Analyzing engagement for "${JSON.stringify(message.value.source)}"`);
  // Index data to Elasticsearch
  // parse the string JSON returned from Kafka
  // pass an array containing the object to the bulk method
  // using bulk to set a custom-id and avoid duplicates
  await elasticsearch.bulk(ELASTIC_SEARCH_INDEX, [JSON.parse(message.value)]);
});

// Gracefully handle process termination
process.on('SIGTERM', () => {
  kafka.unsubscribe(KAFKA_TOPIC);
  process.exit(0);
});