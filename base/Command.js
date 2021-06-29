class Command {

  constructor (client, options) {
    this.client = client;
    this.conf = {
      enabled: options.enabled || true,
      guildOnly: options.guildOnly || false,
      aliases: options.aliases || [],
      botOwner: options.botOwner || false,
      cooldown: ("cooldown" in options) ? options.cooldown : 1,
      options: options.options || [],
      botPermissions: options.botPermissions || [],
      userPermissions: options.userPermissions || []
    };
    this.help = { 
      name: options.name || 'None',
      description: options.description || "No description provided.",
      category: options.category || "Uncategorized",
      usage: ("usage" in options) ? options.usage : "No usage provided."
    };
  }

  run() {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`)
  }

  async _run(ctx) {
    try {
      await this.run(ctx);
    } catch (err) {
      console.error(err);
      ctx.channel.send({embeds: [new ctx.MessageEmbed().setTitle('Oops').setColor(ctx.client.color.error).setDescription(`The error that occured has been logged into our systems. If this is repeative, report it to DanPlayz#7757 at <${process.env.SUPPORT_INVITE}>.\n\`\`\`js\n${err.stack}\`\`\``)]})
    }
  }
}
module.exports = Command;
