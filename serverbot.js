
const { version, MessageEmbed } = require("discord.js");
if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");
if (Number(version.slice(0, 2).split('.')[0]) < 12) throw new Error("Discord.JS 12 or higher is required. Update discord.js");

require('dotenv').config();
require("module-alias/register");

const { CLIENT_OPTIONS } = require('@structures/constants.js');
const BotClient = require('@base/ClientClass.js');
const client = new BotClient(CLIENT_OPTIONS);

client.login(process.env.TOKEN);

client
  .on("disconnect", () => client.logger.log("Bot is disconnecting...", "warn"))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("warn", info => client.logger.log(info, "warn"))
  .on("error", error => client.logger.log(error, "error"));

/* MISCELANEOUS NON-CRITICAL FUNCTIONS */

// EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
// later, this conflicts with native code. Also, if some other lib you use does
// this, a conflict also occurs. KNOWING THIS however, the following methods
// are, we feel, very useful in code. So let's just Carpe Diem.

// <String>.toPropercase() returns a proper-cased string such as: 
// "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
  // Always best practice to let the code crash on uncaught exceptions. 
  // Because you should be catching them anyway.
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});