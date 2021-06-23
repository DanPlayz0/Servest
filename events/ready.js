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

    async function setupInit() {
      // Set the game as the "Playing with servers | {prefix}help"
      client.user.setActivity(`with servers • ${process.env.DEFAULT_PREFIX}help`, {type: "PLAYING"});
    }
  
    setupInit();
    setInterval(setupInit, 120000);

    // Log that we're ready to serve, so we know the bot accepts commands.
    client.logger.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users in ${client.guilds.cache.size} servers.`, "ready");

    // Reboot system.
    await client.database.reboot.ensure();
    let aaa = await client.database.reboot.get();
    if(client.channels.cache.get('795477967768780861') && client.user.id != '559641086524522506'){
      if (aaa.rebooted == "true") {
        client.channels.cache.get('795477967768780861').send(`**The bot has been restarted by** \`User: ${aaa.ranuser}\`**!**`);
      } else {
        client.channels.cache.get('795477967768780861').send(`**The bot has been restarted by** \`Unknown\`**!**`);
      }
    }

    if(aaa.rebooted == "true") {
      await client.channels.cache.get(aaa.channelid).messages.fetch(aaa.messageid).then(message => {
        const em = new MessageEmbed()
          .setColor('GREEN')
          .setDescription("Bot succesfully rebooted");
        message.edit(em);
      });

      await client.database.reboot.update({ rebooted: false, ranuser: null });
    }
  }
};