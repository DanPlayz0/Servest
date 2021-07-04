const GameCommand = require("@base/GameCommand.js");

module.exports = class Minecraft extends GameCommand {
  constructor(client) {
    super(client, {
      name: "tf2",
      description: "Gets info about a Team Fortress 2 server.",
      category: "Games",
      usage: "",
      aliases: ["teamfortress"],

      game: "tf2",
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
      .setTitle(`${state.name}`)
      .addField("Map", `${state.map}`, true)
      .setColor("GREEN")
    return [first, second];
  }
};
