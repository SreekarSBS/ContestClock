// agenda.js
const { Agenda } = require('agenda');

const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: 'jobs' },
});

module.exports = agenda;
