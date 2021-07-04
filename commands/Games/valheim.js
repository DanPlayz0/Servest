const GameCommand = require("@base/GameCommand.js");

module.exports = class Minecraft extends GameCommand {
  constructor(client) {
    super(client, {
      name: "valheim",
      description: "Valheim server info.",
      category: "Games",
      usage: "",
      aliases: ["vh"],

      game: "valheim",
      defaultport: 2456
    });
  }

  async embed(ctx, state, opts) {
    const statEmbed = new ctx.MessageEmbed()
      .setAuthor(`Ping: ${state.ping}ms`)
      .setTitle(`${state.name}`)
      .addField("IP", `${state.connect.split(':')[0]}${Number(state.connect.split(':')[1]) == opts.defaultport ? '': `:${state.connect.split(':')[1]}`}`, true)
      .addField("Players", `${state.players.length || 0}/${state.maxplayers}`, true)
      .setColor("GREEN")
    return [statEmbed];
  }
};
