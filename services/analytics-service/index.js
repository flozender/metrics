require('dotenv').config();

const kafka = require('../../lib/kafka-client');

const KAFKA_TOPIC = 'engagement-tracked';

const trackPost = (message, source) => {
  // Simulate tracking logic
  console.log(`Tracking engagement on "${source}"`);
  // Produce data to Kafka
  kafka.produce(KAFKA_TOPIC, message);
};

module.exports = { trackPost };
