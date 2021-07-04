const GameCommand = require("@base/GameCommand.js");

module.exports = class Minecraft extends GameCommand {
  constructor(client) {
    super(client, {
      name: "csgo",
      description: "Gets info about a csgo server.",
      category: "Games",
      usage: "",
      aliases: ["cs:go"],

      game: "csgo",
      defaultport: 27015
    });
  }

  async embed(ctx, state, opts) {
    const first = new ctx.MessageEmbed()
      .setAuthor(`Ping: ${state.ping}ms`)
      .setTitle(`${state.name}`)
      .addField("IP", `${state.connect.split(':')[0]}${Number(state.connect.split(':')[1]) == opts.defaultport ? '': `:${state.connect.split(':')[1]}`}`, true)
      .addField("Players", `${state.players.length || 0}/${state.maxplayers}`, true)
      .setColor("GREEN")
    const second = new ctx.MessageEmbed()
      .setAuthor(`Ping: ${state.ping}ms`)
      .setTitle(`${state.name} Extra Details`)
      .addField("Map", `${state.map}`, true)
      .addField("Version", `${state.raw.version}`, true)
      .setColor("GREEN")
    let playersMin = state.players.length - 20
    let botsMin = state.bots.length - 20
    const third = new ctx.MessageEmbed()
      .setAuthor(`Ping: ${state.ping}ms`)
      .setTitle(`${state.name} Players`)
      .addField("Players", `${state.players.length ? `${state.players.slice(0, 20).map(p => p.name).join('\n')}${playersMin > 0 ? `${playersMin - 20} more players` : ""} `: "No players online." }`, true)
      .addField("Bots", `${state.bots.length ? `${state.bots.slice(0, 20).map(p => p.name).join('\n')}${botsMin > 0 ? `${botsMin - 20} more bots` : ""} `: "No bots online." }`, true)
      .setColor("GREEN")
    return [first, second, third]
  }
};