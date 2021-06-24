const Command = require("@base/Command.js");
const moment = require("moment");
require("moment-duration-format");
const { version } = require("discord.js");

module.exports = class BotInfo extends Command {
  constructor(client) {
    super(client, {
      name: "config",
      description: "Gives some useful bot statistics.",
      category: "Utility",
      usage: "",
      aliases: [null]
    });
  }

  async run(ctx) {
    let option = ctx.args[0];
    if (!option) return ctx.failEmbed("Invalid option", `Hmm.. It seems that you provided me with an invalid option: \`${option}\``);
    if (!ctx.args[1]) return ctx.failEmbed("No Address provided", "Hmm.. You didnt provide me with an address");
    let host = ctx.args[1].split(":")[0];
    if (!host)
      return ctx.failEmbed(
        "Malformed Address",
        "Hmm.. It seems that you did not provide me with a host, while the port is not required, a hostname is"
      );
    let port = ctx.args[1].split(":")[1];
    let guildData = await ctx.database.guilds.get({ guildid: ctx.guildid });
    switch (option) {
      case "minecraft":
        if (!port) port = 25565;
        console.log(guildData);
        break;
    }
  }
};
