const Command = require("@base/Command.js");
const { validIP, validHost } = require("@structures/functions");
const Gamedig = require("gamedig");

const GameCommand = require("@base/GameCommand.js");

module.exports = class Minecraft extends GameCommand {
  constructor(client) {
    super(client, {
      name: "gmod",
      description: "Gets info about a Garry's Mod server.",
      category: "Games",
      usage: "",
      aliases: ["garrysmod"],

      game: "garrysmod",
      defaultport: 27015
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