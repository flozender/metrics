const  { Client, ResourceAlreadyExistsException } = require('elasticsearch');
const fs = require('fs');
const path = require("path");

const client = new Client({
  host: `https://${process.env.ELASTIC_SEARCH_USERNAME}:${process.env.ELASTIC_SEARCH_PASSWORD}@${process.env.ELASTIC_SEARCH_HOST}`,
  log: 'trace',
  tls: {
    ca: fs.readFileSync(path.resolve(__dirname, './http_ca.crt')),
    rejectUnauthorized: true
  }
});

const elasticsearchClient = {
  createIndex: async (index) => {
    await client.indices.create({ index });
  },
  deleteIndex: async (index) => {
    await client.indices.delete({ index });
  },
  index: async (index, data) => {
    await client.index({ index, body: data });
  },
  getDocument: async (index, id) => {
    await client.get({ index, id });
  },
  ResourceAlreadyExistsException
};

module.exports = elasticsearchClient;
