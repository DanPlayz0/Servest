const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  guildid: String,
  hosts: {
    csgo: Array,
    fivem: Array,
    gmod: Array,
    minecraft: Array,
    r6: Array,
    rust: Array,
    tf2: Array,
    unturned: Array,
    valheim: Array,
  }
});

module.exports = mongoose.model("guilds", guildSchema);