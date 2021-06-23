const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  guildid: String,
  hosts: {
    minecraft: Array, // !mc 1 - {ip:port} !mc 2 {ip:port}
    csgo: Array,
    cs16: Array,
    garrysmod: Array,
    fivem: Array,
    rust: Array,
  }
});

module.exports = mongoose.model("guilds", guildSchema);