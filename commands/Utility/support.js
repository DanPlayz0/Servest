const Command = require("@base/Command.js");

module.exports = class SupportCMD extends Command {
  constructor(client) {
    super(client, {
      name: "support",
      description: "Get the bot's support server",
      category: "Utility",
      usage: "",
      aliases: [],
    });
  }

  async run(ctx) {
    ctx.channel.send({embeds: [new ctx.MessageEmbed().setColor("BLURPLE").setTitle("Need help?").setDescription(`${process.env.SUPPORT_INVITE}`)]})
  }
}