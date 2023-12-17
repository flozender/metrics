const Kafka = require('kafka-node');

const Producer = Kafka.Producer;
const Consumer = Kafka.Consumer;

const client = new Kafka.KafkaClient({ kafkaHost: process.env.KAFKA_HOST });
const producer = new Producer(client);

const kafka = {
  produce: (topic, message) => {
    // attach messages to topic
    const payloads = [{ topic, messages: message}];
      producer.send(payloads, (err, data) => {
        if (err) console.error(err);
        console.log(`Produced to ${topic}`, data);
      });
  },
  subscribe: (topic, callback) => {
    const consumer = new Consumer(client, [{ topic }]);
    consumer.on('message', callback);
  },
};

module.exports = kafka;
