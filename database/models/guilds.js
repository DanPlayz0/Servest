const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  guildid: String,
  images: Object
});

module.exports = mongoose.model("guilds", guildSchema);