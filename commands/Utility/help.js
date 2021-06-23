const Command = require("@base/Command.js");

/*
  The HELP command is used to display every command's name and description
  to the user, so that he may see what commands are available. The help
  command is also filtered by level, so if a user does not have access to
  a command, it is not shown to them. If a command name is given with the
  help command, its extended help is shown.
*/
class Help extends Command {
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
    ctx.channel.send(embed);
  }
}

module.exports = Help;