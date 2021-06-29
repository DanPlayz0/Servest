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
    const myCommands = process.env.OWNERS.split(' ').includes(ctx.author.id) ? ctx.client.commands : ctx.client.commands.filter(m => m.help.category != "System")
    const categories = [...new Set(myCommands.map(m => m.help.category))]
    categories.map((category, i) => {
      embed.addField(category, myCommands.filter(d => d.help.category == category).map(c => `\`${ctx.prefix}${c.help.name}\` - ${c.help.description}`).join('\n'), i == 0)
      if (i == 0) embed.addField("Info", 'Easily monitor your Game servers\n[Website (Coming Soon)](https://serverbot.vd.wtf)\n[Invite](https://serverbot.vd.wtf/invite)', true)
    })
    ctx.channel.send({embeds: [embed]});
  }
}