class Command {

  constructor (client, options) {
    this.client = client;
    this.conf = {
      enabled: options.enabled || true,
      guildOnly: options.guildOnly || false,
      aliases: options.aliases || [],
      permLevel: options.permLevel || "User",
      cooldown: (options.cooldown || options.cooldown == 0) ? options.cooldown : 1,
      options: options.options || [],
    };
    this.help = { 
      name: options.name || 'None',
      description: options.description || "No description provided.",
      category: options.category || "Uncategorized",
      usage: (options.usage || options.usage == "") ? options.usage : "No usage provided."
    };
  }

  run() {
    throw new Error(`${this.constructor.name} doesn't have a run() method.`)
  }

  async _run(ctx) {
    try {
      await this.run(ctx);
    } catch (err) {
      ctx.client.logger.log(err.message, 'error');
    }
  }
}
module.exports = Command;
