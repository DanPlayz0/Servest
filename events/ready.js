const Event = require('@base/Event.js');
const mongoose = require("mongoose");
const { MessageEmbed } = require('discord.js');

module.exports = class extends Event {
  constructor (client) {
    super(client, {
      name: 'ready',
      enabled: true,
    });
  }

  async run (client) {

    // NOTE: client.wait is added by ./modules/functions.js!
    await client.wait(1000);

    // Setup MongoDB connection.
    await mongoose.connect(process.env.MONGODB_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    if (!client.shard || client.shardId == 0) {
      client.site = new (require("@website/index.js"))(client);
      client.site.listen(process.env.WEB_PORT);
    }

    async function setupInit() {
      // Set the game as the "Playing with servers | {prefix}help"
      client.user.setActivity(`with servers • ${process.env.DEFAULT_PREFIX}help`, {type: "PLAYING"});
    }
  
    setupInit();
    setInterval(setupInit, 120000);

    // Log that we're ready to serve, so we know the bot accepts commands.
    client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");
  }
};