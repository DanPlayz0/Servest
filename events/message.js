// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.
const { escapeRegExp } = require("@structures/Utils");
const Discord = require("discord.js");
const Event = require("@base/Event.js");
const moment = require("moment");
const CommandContext = require("@base/CommandContext");

module.exports = class extends Event {
  constructor(client) {
    super(client, {
      name: "message",
      enabled: true
    });
  }

  async run(client, message, isEdited = false) {
    const { author, channel, content, guild } = message;

    if (author.bot || (guild && !channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES"))) return;

    // Prefix related tasks
    const prefix = process.env.DEFAULT_PREFIX; //client.getPrefix(client, message.guild);
    let guildDb = await client.redis.get(`SERVBOT:SETTINGS_${message.guild.id}`)
    if (!guildDb) {
      guildDb = await client.database.guilds.getOne({ guildid: message.guild.id });
      if(guildDb) client.redis.setex(`SERVBOT:SETTINGS_${message.guild.id}`, 60 * 60, JSON.stringify(guildDb));
    } else guildDb = JSON.parse(guildDb);

    const fixedPrefix = escapeRegExp(guildDb?.prefix || prefix);
    const fixedUsername = escapeRegExp(client.user.username);
    const PrefixRegex = new RegExp(`^(<@!?${client.user.id}>|${fixedUsername}|${fixedPrefix})`, "i", "(s+)?");

    let usedPrefix = content.match(PrefixRegex);
    usedPrefix = usedPrefix && usedPrefix.length && usedPrefix[0];

    // Mention related tasks
    const MentionRegex = new RegExp(`^(<@!?${client.user.id}>)`);
    const mentioned = MentionRegex.test(content);
    const helpPrefix = `👋 Hai! This guild's prefix is \`${prefix}\``;

    if (!usedPrefix) return; // Exit if its not using a prefix
    // Here we separate our "command" name, and our "arguments" for the command.
    const args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // If the member on a guild is invisible or not cached, fetch them.
    if (message.guild && !message.member) await message.guild.members.fetch(message.author);

    // Check whether the command, or alias, exist in the collections defined
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    // Check if command exists.
    if (!cmd && mentioned) return message.channel.send(helpPrefix);
    if (!cmd) return;

    // Some commands may not be useable in DMs. This check prevents those commands from running
    if (cmd && !message.guild && cmd.conf.guildOnly) return message.channel.send("This command is unavailable via private message. Please run this command in a guild.");

    // Command Cooldown System
    let cooldowns = client.cooldowns;
    if (!cooldowns.has(cmd.help.name)) {
      cooldowns.set(cmd.help.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(cmd.help.name);
    const cooldownAmount = (cmd.conf.cooldown || 0) * 1000;
    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.react('🕐');
        // return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.help.name}\` command.`);
      }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    
    // Owner Lock
    if (cmd.conf.botOwner == true && !process.env.OWNERS.split(" ").includes(message.author.id)) {
      const e = new Discord.MessageEmbed()
        .setTitle("Unauthorized")
        .setColor("RED")
        .setDescription(`You have to be ${process.env.OWNERS.split(" ").length == 1 ? "the" : "a"} **Bot Owner** to use this command.`);
      message.channel.send({embeds: [e], attachments: [new Discord.MessageAttachment("https://shanara.nyc3.digitaloceanspaces.com/376901199225552898/uCo7cqbOLp5yZtJx9IKmv5SPP.mp4", "HaHaFucyou.mp4")]});
      client.logger.log(`${message.author.username} (${message.author.id}) ran unauthorized command ${cmd.help.name} ${args.join(" ")}`, "unauthorized");
      return;
    }
    
    // User Perms
    if(cmd.conf.userPermissions.length > 0 && cmd.conf.userPermissions.every(perm => message.member.permissions.has(Discord.Permissions.FLAGS[perm]) === false)) {
      const e = new Discord.MessageEmbed()
      .setTitle('Missing User Permissions')
      .setColor('RED')
      .setDescription(`You are missing \`${cmd.conf.userPermissions.filter(p => !message.member.permissions.has(Discord.Permissions.FLAGS[p])).join(", ").toUpperCase()}\` to run this command`);
      message.channel.send({embeds: [e]});
      return;
    }
    
    // Bot Perm
    if(cmd.conf.botPermissions.length > 0 && cmd.conf.botPermissions.every(perm => message.guild.me.permissions.has(Discord.Permissions.FLAGS[perm]) === false)) {
      const e = new Discord.MessageEmbed()
      .setTitle('Missing Bot Permissions')
      .setColor('RED')
      .setDescription(`I am missing \`${cmd.conf.botPermissions.filter(p => !message.guild.me.permissions.has(Discord.Permissions.FLAGS[p])).join(", ").toUpperCase()}\` to run this command.`);
      message.channel.send({embeds: [e]});
      return;
    }
    
    // If the command exists, **AND** the user has permission, run it.
    //this.client.logger.log(`${this.client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) ran command ${cmd.help.name} ${args.join(' ')}`, "cmd");
    try {
      const params = { args, message, prefix: prefix, query: args.join(" "), guildDb };
      cmd._run(new CommandContext(params));
    } catch (error) {
      console.log(error);
      message.channel
        .send("There was an error executing that command.")
        .catch(console.error);
    }
  }
};
