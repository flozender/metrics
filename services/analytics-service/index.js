require('dotenv').config();

const kafka = require('../../lib/kafka-client');

const KAFKA_TOPIC = 'engagement-tracked';

const trackSearchTerm = (searchTerm, likes) => {
  // Simulate tracking logic
  console.log(`Tracking engagement for "${searchTerm}"`);
  // Produce data to Kafka
  kafka.produce(KAFKA_TOPIC, { searchTerm, timestamp: Date.now(), likes });
};

trackSearchTerm("Blockchain is gonna pop off!", 9);

module.exports = { trackSearchTerm };
