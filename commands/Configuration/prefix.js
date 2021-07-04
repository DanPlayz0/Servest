const Command = require("@base/Command.js");

module.exports = class PrefixCMD extends Command {
  constructor(client) {
    super(client, {
      name: "prefix",
      description: "Configure the server's prefix.",
      category: "Configuration",
      usage: "<new_prefix>",
      aliases: ['setprefix'],
      userPermissions: ['MANAGE_GUILD']
    });
  }

  async run(ctx) {
    const e = new ctx.MessageEmbed();

    if (ctx.args.length < 1 || !ctx.args[0]) return e.setTitle('Error').setDescription('Please specify a prefix.').setColor('RED') && ctx.channel.send({embeds: [e]});
    try {
      await ctx.database.guilds.update({ guildid: ctx.guild.id }, { prefix: ctx.args[0] });
      e.setTitle('Successful').setDescription(`This server's prefix has been changed to \`${ctx.args[0]}\``).setColor('GREEN');
      ctx.channel.send({embeds: [e]});

      let guildDb = await ctx.database.guilds.getOne({ guildid: ctx.guild.id });
      ctx.redis.setex(`SERVBOT:SETTINGS_${ctx.guild.id}`, 60 * 60, JSON.stringify(guildDb));
    } catch (err) {
      console.error(err);
      e.setTitle('Error').setDescription(`An error occured while trying to change the server's prefix.`).setColor('GREEN');
      ctx.channel.send({embeds: [e]});
    }
  }
};