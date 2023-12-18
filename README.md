# Metrics

Metrics is a microservice based user engagement tracker system built using Node.js. It's built using Apache Zookeeper, Apache Kafka, ElasticSearch, Kibana, and Docker.

## Installing
First, set up Apache Zookeeper, Apache Kafka, ElasticSearch, and Kibana.

Then set up the project:
```bash
git clone https://github.com/flozender/metrics
cd services/analytics-service
npm install
cd ../services/tracker-service
npm install
```

### Configure .env files
Checkout the `.env.example` files in each microservice for the required environment variables.

### http_ca.crt file
Paste the `http_ca.crt` file you obtain from ElasticSearch in `lib/` to secure your network calls.

## Running the services
After setting up the project:
```bash
node services/tracker-service/index.js

node services/analytics-service/twitter.js
node services/analytics-service/mastodon.js
```