const Command = require("@base/Command.js");

module.exports = class BotInfo extends Command {
  constructor(client) {
    super(client, {
      name: "config",
      description: "Configure a server host and port.",
      category: "Utility",
      usage: "<gameid> <host:port>",
      aliases: []
    });
  }

  async run(ctx) {
    const gameCommands = ctx.client.commands.filter(m => m.help.category == "Games");
    if (ctx.args.length < 1) return ctx.failEmbed("Invalid option", `Hmm.. It seems that you didn't provide an option.\n\nPossible Options: ${gameCommands.map(m => `\`${m.game}\``).join(' ')}`);
    let option = ctx.args[0], id = ctx.args[1];
    if (!option || !gameCommands.map(m => m.game).includes(option)) return ctx.failEmbed("Invalid option", `Hmm.. It seems that you provided me with an invalid option: \`${option}\``);
    if (!/^([1-9][0-9]?|100)$/.test(id)) return ctx.failEmbed('No ID provided', `Please provide an ID from 1-100 to set it to your guild!`)
    if (!ctx.args[2]) return ctx.failEmbed("No Address provided", "Hmm.. You didnt provide me with an address");
    let host = ctx.args[2].split(":")[0];
    if (!host) return ctx.failEmbed("Malformed Address", "Hmm.. It seems that you did not provide me with a host, while the port is not required, a hostname is");
    let port = ctx.args[2].split(":")[1];
    const defaultPort = gameCommands.find(m => m.game.toLowerCase() == option.toLowerCase()).defaultport;
    if (!port) port = defaultPort;

    let guildData = await ctx.database.guilds.getOne({ guildid: ctx.guild.id });
    if(!guildData) {
      await ctx.database.guilds.set({ guildid: ctx.guild.id });
      guildData = await ctx.database.guilds.getOne({ guildid: ctx.guild.id });
    }

    const obj = Object.assign(guildData, {})
    const serverObj = { host, port, id: Number(id) };
    if(obj.hosts[option].find(m => m.id == id)) obj.hosts[option][obj.hosts[option].findIndex(m => m.id == id)] = serverObj;
    else obj.hosts[option] = [...(guildData.hosts[option] || []), serverObj];
    
    await ctx.database.guilds.update({ guildid: ctx.guild.id }, obj);

    guildData = (await ctx.database.guilds.getOne({ guildid: ctx.guild.id }));
    await ctx.redis.setex(`SERVBOT:${ctx.guild.id}`, 60 * 60, JSON.stringify(guildData));

    ctx.channel.send({embeds: [new ctx.MessageEmbed().setColor('GREEN').setTitle(`Updated \`${option.toProperCase()}\` config`).setDescription(`${obj.hosts[option].sort((a,b) => a.id - b.id).map(d => `**${d.id}** | ${d.host}${d.port == defaultPort ? "" : `:${d.port}`}`).join('\n')}`)]});
  }
};
