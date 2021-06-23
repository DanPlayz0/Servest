const Command = require("@base/Command.js");
const { validIP, validHost } = require('@structures/functions');
const Gamedig = require('gamedig');

module.exports = class Minecraft extends Command {
  constructor (client) {
    super(client, {
      name: "minecraft",
      description: "Gets data about a minecraft server.",
      category: "Games",
      usage: "",
      aliases: ['mc', 'mcip']
    });
  }

  async run (ctx) { // eslint-disable-line no-unused-vars
    const guildData = (await ctx.database.guilds.get({ guildid: ctx.guildid })).minecraft;
    if(guildData.length == 0) return ctx.failEmbed("Setup Required", `Please ask an administator to setup this command. Using \`${ctx.prefix}config ${this.help.name} IP:PORT\``);
    if(isNaN(ctx.args[0]) || Number(ctx.args[0]) > 20 || Number(ctx.args[0]) < 1) return ctx.failEmbed("Setup Required", `Please ask an administator to setup this command. Using \`${ctx.prefix}config ${this.help.name} IP:PORT\``);

    let host = ctx.args[0], port = ctx.args[1];
    if (![validIP(host), validHost(host)].some(x => x==true)) return ctx.failEmbed("Malformed Address", "Hmm.. It seems that you provided me with a malformed address");
    let msg = await ctx.channel.send({embeds: [new ctx.MessageEmbed().setTitle("Pinging...").toJSON()]})
    Gamedig.query({
      type: 'minecraft',
      host: host, port: port || undefined
    }).then(async (state) => {
      console.log(state);
      const statEmbed = new ctx.MessageEmbed()
        .setTitle(`${state.name}`)
        // .setURL()
        .addField('IP', state.connect, true)
        .addField('Players', `${state.players.length}/${state.raw.maxplayers}`, true)
        .addField('Connect', state.connect, true)
        
      msg.edit({embeds: [statEmbed]})
    }).catch((error) => {
      msg.edit({embeds: [new ctx.MessageEmbed().setTitle("Server offline...").setColor('RED').toJSON()]})
      console.log("Server is offline");
    });
  }
}