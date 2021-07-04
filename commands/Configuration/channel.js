const Command = require("@base/Command.js");

module.exports = class BotInfo extends Command {
  constructor(client) {
    super(client, {
      name: "channel",
      description: "Configure an auto-updating channel.",
      category: "Configuration",
      usage: "<edit||list>",
      aliases: [],
      userPermissions: ['MANAGE_GUILD'],
      enabled: false
    });
  }

  async run(ctx) {
    if (ctx.args.length < 1) return ctx.failEmbed("Invalid Usage", `It seems you have forgotten how this command works.\nUsage: \`${ctx.prefix}${this.help.name} ${this.help.usage}\``)
    if (ctx.args.length < 2) return ctx.failEmbed("Missing Arguments", `Hmm.. It seems that you didn't provide an channelid.`);
    const action = ctx.args[0], actions = ['edit', 'info'], channelid = ctx.args[1], hostport = ctx.args[2];
    if (!action || !actions.includes(action)) return ctx.failEmbed('Invalid Action', `Hmm.. It seems that you didn't provide a valid action.\n\nPossible Actions: ${actions.map(m => `\`${m.game}\``).join(' ')}`)
    if (!channelid || !ctx.guild.channels.cache.map(m => m.id).includes(channelid)) return ctx.failEmbed("Invalid Channel", `Hmm.. It seems that you provided me with an invalid channel id (ID: ${channelid})`);
    switch (action) {
      case "edit": {
        if (!hostport) return ctx.failEmbed("No Address provided", "Hmm.. You didnt provide me with an address");
        let host = hostport.split(":")[0];
        if (!host) return ctx.failEmbed("Malformed Address", "Hmm.. It seems that you did not provide me with a host, while the port is not required, a hostname is");
        let port = hostport.split(":")[1];
        const defaultPort = gameCommands.find(m => m.game.toLowerCase() == gameid.toLowerCase()).defaultport;
        if (!port) port = defaultPort;

        let guildData = await ctx.database.guilds.getOne({ guildid: ctx.guild.id });
        if (!guildData) {
          await ctx.database.guilds.set({ guildid: ctx.guild.id });
          guildData = await ctx.database.guilds.getOne({ guildid: ctx.guild.id });
        }
        const obj = Object.assign(guildData, {})
        const serverObj = { host, port, id: Number(id) };
        if (obj.hosts[option].find(m => m.id == id)) obj.hosts[option][obj.hosts[option].findIndex(m => m.id == id)] = serverObj;
        else obj.hosts[option] = [...(guildData.hosts[option] || []), serverObj];

        await ctx.database.guilds.update({ guildid: ctx.guild.id }, obj);

        guildData = (await ctx.database.guilds.getOne({ guildid: ctx.guild.id }));
        await ctx.redis.setex(`SERVBOT:${ctx.guild.id}`, 60 * 60, JSON.stringify(guildData));

        ctx.channel.send({ embeds: [new ctx.MessageEmbed().setColor('GREEN').setTitle(`Updated \`${option.toProperCase()}\` config`).setDescription(`${obj.hosts[option].sort((a, b) => a.id - b.id).map(d => `**${d.id}** | ${d.host}${d.port == defaultPort ? "" : `:${d.port}`}`).join('\n')}`)] });
      } break;
      case "info": {
        ctx.channel.send({ embeds: [new ctx.MessageEmbed().setColor('GREEN').setTitle(`\`${option.toProperCase()}\` config`).setDescription(`${obj.hosts[option].sort((a, b) => a.id - b.id).map(d => `**${d.id}** | ${d.host}${d.port == defaultPort ? "" : `:${d.port}`}`).join('\n')}`)] });

      } break;
    }

  }

  async edit(ctx) {

  }
};