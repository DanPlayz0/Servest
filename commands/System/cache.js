const Command = require("@base/Command.js");
const stringTools = (new (require('string-toolkit')))
const { inspect } = require('util');

module.exports = class ExecuteCMD extends Command {
  constructor(client) {
    super(client, {
      name: "fcache",
      description: "Haha cache go BRRR",
      category: "System",
      usage: "<console command>",
      aliases: ['exec'],
      cooldown: 0,
      botOwner: true,
    });
  }

  async run(ctx) {
    try {
      await require('child_process').execSync('redis-cli flushdb').toString();
      ctx.channel.send({embeds: [
        new ctx.MessageEmbed()
          .setColor('GREEN')
          .setTitle("Cache Flushed")
          .setDescription("You have flushed (UwU) the Redis cache")
      ]})
    
    } catch (err) {
      ctx.message.channel.send({embeds: [
        new ctx.MessageEmbed()
          .addField('Error', `\`\`\`js\n${err}\`\`\``)
          .setColor('RED')
      ]});
    }
  }
}