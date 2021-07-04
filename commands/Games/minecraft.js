const GameCommand = require("@base/GameCommand.js");

module.exports = class Minecraft extends GameCommand {
  constructor(client) {
    super(client, {
      name: "minecraft",
      description: "Gets info about a minecraft server.",
      category: "Games",
      usage: "",
      aliases: ["mc", "mcip"],

      game: "minecraft",
      defaultport: 25565
    });
  }

  async embed(ctx, state, opts) {
    console.log()
    const first = new ctx.MessageEmbed()
      .setAuthor(`Ping: ${state.ping}ms`)
      .setTitle(`${state.name}`)
      .addField("IP", `${state.connect.split(':')[0]}${Number(state.connect.split(':')[1]) == opts.defaultport ? '': `:${state.connect.split(':')[1]}`}`, true)
      .addField("Players", `${state.raw.vanilla.raw.players.online}/${state.raw.vanilla.raw.players.max}`, true)
      .setColor("GREEN")
      .setImage(`http://status.mclive.eu/${opts.host.toProperCase()}/${opts.host}/${opts.port}/banner.png`);
    return [first];
  }
};
