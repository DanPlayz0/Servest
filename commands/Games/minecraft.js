const Command = require("@base/Command.js");
const { validIP, validHost } = require("@structures/functions");
const Gamedig = require("gamedig");

module.exports = class Minecraft extends Command {
  constructor(client) {
    super(client, {
      name: "minecraft",
      description: "Gets data about a minecraft server.",
      category: "Games",
      usage: "",
      aliases: ["mc", "mcip"]
    });
  }

  async run(ctx) {
    let first = ctx.args[0];
    let host;
    let port = 25565;
    if (/^([1-9][0-9]?|100)$/.test(first)) {
      const guildData = (await ctx.database.guilds.getOne({ guildid: ctx.guild.id }))?.hosts?.minecraft;
      if (!guildData || guildData.length == 0)
        return ctx.failEmbed("Setup Required", `Please ask an administator to setup this command. Using \`${ctx.prefix}config ${this.help.name} [1-100] [IP:PORT]\``);
      let record = guildData[Number(first)-1];
      host = record?.host;
      port = record?.port || 25565;
      if (!host) return ctx.failEmbed("Not a valid host", `The provided ID for minecraft (ID: ${first}) has not been setup. Please ask an administator to set it up. Using \`${ctx.prefix}config ${this.help.name} [1-100] [IP:PORT]\``);
    } else {
      if (!first) return ctx.failEmbed("No Address provided", `You need to provide an address to search for system Status`);
      let address = first.split(":")[0];
      let pport = first.split(":")[1];
      if (address) host = address;
      if (pport) port = pport;
    }
    if (![validIP(host), validHost(host)].some((x) => x == true))
      return ctx.failEmbed("Malformed Address", "Hmm.. It seems that you provided me with a malformed address");
    let msg = await ctx.channel.send({ embeds: [new ctx.MessageEmbed().setColor('BLURPLE').setTitle("<a:loading:660004752104620036> Pinging...").toJSON()] });
    Gamedig.query({ type: "minecraft", host: host, port: port || undefined }).then(async (state) => {
      console.log(state);
      const statEmbed = new ctx.MessageEmbed()
        .setTitle(`${state.name}`)
        .addField("IP", `${state.connect.split(':')[0]}${Number(state.connect.split(':')[1]) == 25565 ? '': `:${state.connect.split(':')[1]}`}`, true)
        .addField("Players", `${state.players.length || 0}/${state.maxplayers}`, true)
        .setColor("GREEN")
        .setImage(`http://status.mclive.eu/${host.toProperCase()}/${host}/${port}/banner.png`);
      msg.edit({ embeds: [statEmbed] });
    }).catch((error) => {
      msg.edit({ embeds: [new ctx.MessageEmbed().setTitle("Error").setDescription('Server is offline or the IP is incorrect.').setColor("RED").toJSON()] });
    });
  }
};
