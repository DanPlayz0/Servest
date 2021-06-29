const Event = require('@base/Event.js');

module.exports = class extends Event {
  constructor (client) {
    super(client, {
      name: 'shardReady',
      enabled: true,
    });
  }

  async run (client, id, unavailableGuilds) {
    client.shardId = id;
  }
};