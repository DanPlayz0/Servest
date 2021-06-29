const GameCommand = require("@base/GameCommand.js");

module.exports = class Minecraft extends GameCommand {
  constructor(client) {
    super(client, {
      name: "fivem",
      description: "Gets info about a FiveM server.",
      category: "Games",
      usage: "",
      aliases: ["gtarp"],

      game: "fivem",
      defaultport: 30110
    });
  }

  async embed(ctx, state, opts) {
    const statEmbed = new ctx.MessageEmbed()
      .setTitle(`${state.name}`)
      .addField("IP", `${state.connect.split(':')[0]}${Number(state.connect.split(':')[1]) == opts.defaultport ? '': `:${state.connect.split(':')[1]}`}`, true)
      .addField("Players", `${state.players.length || 0}/${state.maxplayers}`, true)
      .setColor("GREEN")
    return statEmbed;
  }
};