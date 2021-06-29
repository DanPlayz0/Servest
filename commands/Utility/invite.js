const Command = require("@base/Command.js");

module.exports = class InviteCMD extends Command {
  constructor(client) {
    super(client, {
      name: "invite",
      description: "Get the bot's invite",
      category: "Utility",
      usage: "",
      aliases: [],
    });
  }

  async run(ctx) {
    ctx.channel.send({embeds: [new ctx.MessageEmbed().setColor("BLURPLE").setTitle("Invite me!!").setDescription(`Wanna add me to your server? Click the link below to get started!\n[[Click me!]](https://serverbot.vd.wtf)`)]})
  }
}