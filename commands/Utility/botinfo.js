const Command = require("@base/Command.js");
const moment = require("moment");
require("moment-duration-format");
const { version } = require('discord.js');

class BotInfo extends Command {
  constructor (client) {
    super(client, {
      name: "botinfo",
      description: "Gives some useful bot statistics.",
      category: "Utility",
      usage: "",
      aliases: ['stats', 'bi', 'uptime']
    });
  }

  async run ({ client, message, args, level, database, MessageEmbed }) { // eslint-disable-line no-unused-vars
    const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    let os;
    if (process.platform) {
      const platform = process.platform;
      if (platform === 'win32') os = 'Windows';
      else if (platform === 'aix') os = 'Aix';
      else if (platform === 'linux') os = 'Linux';
      else if (platform === 'darwin') os = 'Darwin';
      else if (platform === 'openbsd') os = 'OpenBSD';
      else if (platform === 'sunos') os = 'Solaris';
      else if (platform === 'freebsd') os = 'FreeBSD';
    }
  
  
    const e = new MessageEmbed()
      .setTitle('Bot Info')
      .setColor('BLUE')
      //.addField('Mem Usage', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
      .addField('Uptime', duration, true)
      .addField('User Count', `${client.users.cache.size.toLocaleString()} users`, true)
      .addField('Server Count', `${client.guilds.cache.size.toLocaleString()} servers`, true)
      .addField('Operating System', `${os}`, true)
      .addField('Node Version', process.version, true)
      .addField('Discord.js Version', `v${version}`, true)
      .setTimestamp()
      .setFooter(message.author.username, message.author.avatarURL());
    message.channel.send(e);
  }
}

module.exports = BotInfo;
