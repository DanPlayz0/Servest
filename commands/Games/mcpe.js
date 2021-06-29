const GameCommand = require("@base/GameCommand.js");

module.exports = class Minecraft extends GameCommand {
  constructor(client) {
    super(client, {
      name: "mcpe",
      description: "Gets info about a minecraft bedrock server.",
      category: "Games",
      usage: "",
      aliases: ["minecraftpe"],

      game: "minecraftpe",
      defaultport: 19132
    });
  }

  async embed(ctx, state, opts) {
    const statEmbed = new ctx.MessageEmbed()
      .setTitle(`${state.name}`)
      .addField("IP", `${state.connect.split(':')[0]}${Number(state.connect.split(':')[1]) == opts.defaultport ? '': `:${state.connect.split(':')[1]}`}`, true)
      .addField("Players", `${state.players.length || 0}/${state.maxplayers}`, true)
      .setColor("GREEN")
      .setImage(`http://status.mclive.eu/${opts.host.toProperCase()}/${opts.host}/${opts.port}/banner.png`);
    return statEmbed;
  }
};
