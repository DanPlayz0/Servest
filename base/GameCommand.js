const Command = require('./Command');
const { validIP, validHost } = require("@structures/functions");
const Gamedig = require("gamedig");

module.exports = class GameCommand extends Command {
  constructor(client, options){
    super(client, options);
    
    this.game = options.game;
    this.defaultport = options.defaultport;
  }

  async run(ctx) {
    let first = ctx.args[0];
    let host;
    let port = this.defaultport;
    if (/^([1-9][0-9]?|100)$/.test(first)) {
      let guildData = await ctx.redis.get(`SERVBOT:GUILD_${ctx.guild.id}`)
      if (!guildData) {
        guildData = (await ctx.database.guilds.getOne({ guildid: ctx.guild.id }));
        await ctx.redis.setex(`SERVBOT:${ctx.guild.id}`, 60 * 60, JSON.stringify(guildData));
        guildData = guildData.hosts[this.game];
      } else guildData = JSON.parse(guildData);
      if (!guildData || guildData.length == 0) return ctx.failEmbed("Setup Required", `Please ask an administator to setup this command. Using \`${ctx.prefix}config ${this.help.name} [1-100] [IP:PORT]\``);
      let record = guildData[Number(first)-1];
      host = record?.host;
      port = record?.port || this.defaultport;
      if (!host) return ctx.failEmbed("Not a valid host", `The provided ID for ${this.help.name} (ID: ${first}) has not been setup. Please ask an administator to set it up. Using \`${ctx.prefix}config ${this.help.name} [1-100] [IP:PORT]\``);
    } else {
      if (!first) return ctx.failEmbed("No Address provided", `You need to provide an address to search for system status`);
      let address = first.split(":")[0];
      let pport = first.split(":")[1];
      if (address) host = address;
      if (pport) port = pport;
    }
    if (![validIP(host), validHost(host)].some((x) => x == true)) return ctx.failEmbed("Malformed Address", "Hmm.. It seems that you provided me with a malformed address");
    let res = await ctx.redis.get(`SERVBOT:${this.game}_${host}-${port ||'none'}`)
    if (res) {
      res = JSON.parse(res);
      let e = await this.embed(ctx, res.state, { game: this.game, defaultport: this.defaultport, host, port });
      if(Array.isArray(e)) e.map(embed => embed.setFooter('This data was cached').setTimestamp(res.cached));
      else e.setFooter('This data was cached at').setTimestamp(res.cached);
      return ctx.pagination(e);
    }
    let msg = await ctx.channel.send({ embeds: [new ctx.MessageEmbed().setColor('BLURPLE').setTitle("<a:loading:660004752104620036> Pinging...").toJSON()] });
    Gamedig.query({ type: this.game, host, port: port || undefined }).then(async (state) => {
      const em = await this.embed(ctx, state, { game: this.game, defaultport: this.defaultport, host, port })
      if(Array.isArray(em)) em.map(embed => embed.setFooter('This data is live, and will be cached for 5 minutes.'));
      else em.setFooter('This data is live, and will be cached for 5 minutes.');
      ctx.pagination(em, {message: msg});
      await ctx.redis.setex(`SERVBOT:${this.game}_${host}-${port||'none'}`, 60 * 5, JSON.stringify({ state, cached: new Date().toISOString() }));
    }).catch((error) => {
      
      console.error(error);
      msg.edit({ embeds: [new ctx.MessageEmbed().setTitle("Error").setDescription('Server is offline or the IP is incorrect.').setColor("RED").toJSON()] });
    });
  }

  embed(ctx, state, opts) {
    throw new Error(`${this.constructor.name} doesn't have a embed() method.`)
  }
}