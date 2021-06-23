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
      aliases: ['mc']
    });
  }

  async run (ctx) { // eslint-disable-line no-unused-vars
    let host = ctx.args[0], port = ctx.args[1];
    if (!host) return ctx.failEmbed("Setup Required", `Please ask an administator to setup this command. Using \`${ctx.prefix}config ${this.help.name} IP:PORT\``)
    if (![validIP(host), validHost(host)].some(x => x==true)) return ctx.failEmbed("Malformed Address", "Hmm.. It seems that you provided me with a malformed address");
    let msg = await ctx.channel.send({embeds: [new ctx.MessageEmbed().setTitle("Pinging...").toJSON()]})
    Gamedig.query({
      type: 'minecraft',
      host: host, port: port || undefined
    }).then(async (state) => {
      console.log(state);
      let statEmbed = new ctx.MessageEmbed()
        .setTitle(`${host} stats`)
        .setURL()
        .addField('Players', `${state.players.length}/${state.maxplayers}`)
        .addField('IP', state.connect)
        .addField('Connect', state.connect)
        
      msg.edit({embeds: [statEmbed]})
    }).catch((error) => {
      msg.edit({embeds: [new ctx.MessageEmbed().setTitle("Server offline...").setColor('RED').toJSON()]})
      console.log("Server is offline");
    });
  }
}

/*
Gamedig.query({
    type: 'minecraft',
    host: 'mc.example.com'
}).then((state) => {
    console.log(state);
}).catch((error) => {
    console.log("Server is offline");
});*/