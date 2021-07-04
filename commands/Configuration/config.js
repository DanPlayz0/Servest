const Command = require("@base/Command.js");

module.exports = class BotInfo extends Command {
  constructor(client) {
    super(client, {
      name: "config",
      description: "Configure a server host and port.",
      category: "Configuration",
      usage: "<add|edit|list> <gameid> <id> <host:port>",
      aliases: ['configure'],
      userPermissions: ['MANAGE_GUILD']
    });
  }

  async run(ctx) {
    if (ctx.args.length < 1) return ctx.failEmbed("Invalid Usage", `It seems you have forgotten how this command works.\nUsage: \`${ctx.prefix}${this.help.name} ${this.help.usage}\``)
    const action = ctx.args[0], gameid = ctx.args[1], gameCommands = ctx.client.commands.filter(m => m.help.category == "Games");
    if (ctx.args.length < 2) return ctx.failEmbed("Invalid Game", `Hmm.. It seems that you didn't provide an gameid.\n\nPossible Options: ${gameCommands.map(m => `\`${m.game}\``).join(' ')}`);
    if (!gameCommands.find(m => m.game == gameid)) return ctx.failEmbed("Invalid Game", `Hmm.. It seems that you provided me with an invalid gameid (ID: ${gameid})`);
    
    if(["edit", "add", "delete"].includes(action)) {
      const id = ctx.args[2];
      if (!/^([1-9][0-9]?|100)$/.test(id)) return ctx.failEmbed('No ID provided', `Please provide an ID from 1-100 to set it to your guild!`);

      const hostport = ctx.args[3];
      if (!hostport) return ctx.failEmbed("No Address provided", "Hmm.. You didnt provide me with an address");
      let host = hostport.split(":")[0];
      if (!host) return ctx.failEmbed("Malformed Address", "Hmm.. It seems that you did not provide me with a host, while the port is not required, a hostname is");
      let port = hostport.split(":")[1];
      const defaultPort = gameCommands.find(m => m.game.toLowerCase() == gameid.toLowerCase()).defaultport;
      if (!port) port = defaultPort;

      let guildData = await ctx.database.guilds.getOne({ guildid: ctx.guild.id });
      if(!guildData) {
        await ctx.database.guilds.set({ guildid: ctx.guild.id });
        guildData = await ctx.database.guilds.getOne({ guildid: ctx.guild.id });
      }
  
      const obj = Object.assign(guildData, {})
      const serverObj = { host, port, id: Number(id) };
      if(obj.hosts[gameid].find(m => m.id == id)) obj.hosts[gameid][obj.hosts[gameid].findIndex(m => m.id == id)] = serverObj;
      else obj.hosts[gameid] = [...(guildData.hosts[gameid] || []), serverObj];
      
      await ctx.database.guilds.update({ guildid: ctx.guild.id }, obj);
  
      guildData = (await ctx.database.guilds.getOne({ guildid: ctx.guild.id }));
      await ctx.redis.setex(`SERVBOT:${ctx.guild.id}`, 60 * 60, JSON.stringify(guildData));
  
      ctx.channel.send({embeds: [new ctx.MessageEmbed().setColor('GREEN').setTitle(`Updated \`${gameid.toProperCase()}\` config`).setDescription(`${obj.hosts[gameid].sort((a,b) => a.id - b.id).map(d => `**${d.id}** | ${d.host}${d.port == defaultPort ? "" : `:${d.port}`}`).join('\n')}`)]});
    } else if(action == "list") {
      ctx.channel.send({content:'not supported yet'});
      // ctx.channel.send({embeds: [new ctx.MessageEmbed().setColor('GREEN').setTitle(`\`${gameid.toProperCase()}\` config`).setDescription(`${obj.hosts[gameid].sort((a,b) => a.id - b.id).map(d => `**${d.id}** | ${d.host}${d.port == defaultPort ? "" : `:${d.port}`}`).join('\n')}`)]});
    }

  }
};
