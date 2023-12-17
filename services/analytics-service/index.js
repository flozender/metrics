require('dotenv').config();

const kafka = require('../../lib/kafka-client');

const KAFKA_TOPIC = 'engagement-tracked';

const trackPost = (content, likes, source) => {
  // Simulate tracking logic
  console.log(`Tracking engagement on "${source}"`);
  // Produce data to Kafka
  kafka.produce(KAFKA_TOPIC, { content, timestamp: Date.now(), likes, source });
};

trackPost("Blockchain is gonna pop off!", 9, "Twitter");

module.exports = { trackPost };
