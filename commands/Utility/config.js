const Command = require("@base/Command.js");

module.exports = class BotInfo extends Command {
  constructor(client) {
    super(client, {
      name: "config",
      description: "Gives some useful bot statistics.",
      category: "Utility",
      usage: "",
      aliases: []
    });
  }

  async run(ctx) {
    if (ctx.args.length < 1) return ctx.failEmbed("Invalid option", `Hmm.. It seems that you didn't provide an option.\n\nPossible Options: ${['minecraft', 'csgo'].map(m => `\`${m}\``).join(' ')}`);
    let option = ctx.args[0];
    if (!option) return ctx.failEmbed("Invalid option", `Hmm.. It seems that you provided me with an invalid option: \`${option}\``);

    if (!ctx.args[1]) return ctx.failEmbed("No Address provided", "Hmm.. You didnt provide me with an address");
    let host = ctx.args[1].split(":")[0];
    if (!host) return ctx.failEmbed("Malformed Address", "Hmm.. It seems that you did not provide me with a host, while the port is not required, a hostname is");
    let port = ctx.args[1].split(":")[1];
    let guildData = await ctx.database.guilds.getOne({ guildid: ctx.guild.id });
    if(!guildData) {
      await ctx.database.guilds.set({ guildid: ctx.guild.id });
      guildData = await ctx.database.guilds.getOne({ guildid: ctx.guild.id });
    }
    switch (option) {
      case "minecraft":
        if (!port) port = 25565;
        await ctx.database.guilds.update({ guildid: ctx.guild.id }, { "hosts.minecraft": [...(guildData?.hosts?.minecraft || []), { host, port }] })
        ctx.channel.send({content:"Updated..."})
        break;
    }
  }
};
