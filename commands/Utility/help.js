const Command = require("@base/Command.js");

module.exports = class Help extends Command {
  constructor (client) {
    super(client, {
      name: "help",
      description: "Displays all the commands.",
      category: "Utility",
      usage: "",
      aliases: ["h", "?"],
      cooldown: 5
    });
  }

  async run (ctx) {
    const embed = new ctx.MessageEmbed()
      .setAuthor(`${ctx.client.user.username} Commands`, ctx.client.user.avatarURL())
      .setFooter(ctx.author.username, ctx.author.avatarURL())
      .setColor('BLUE')
      // .setDescription(`Please use our dashboard at <${process.env.DOMAIN}/dashboard/${ctx.guild.id}/> to customize your server!`)
      .addField('Commands', ctx.client.commands.filter(m => m.help.category != "System").map(m => `\`${ctx.prefix}${m.help.name}\` - ${m.help.description}`).join('\n'));
    ctx.channel.send({embeds: [embed]});
  }
}