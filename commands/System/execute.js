const Command = require("@base/Command.js");
const stringTools = (new (require('string-toolkit')))
const { inspect } = require('util');

class ExecuteCMD extends Command {
    constructor (client) {
      super(client, {
        name: "execute",
        description: "Execute a console command. (Command Prompt Commands)",
        category: "System",
        usage: "<console command>",
        aliases: ['exec'],
        cooldown: 0,
        botOwner: true,
      });
    }

    async run (ctx) {
      const dscformat = (lang, value) => (`\`\`\`${lang}\n${value}\n\`\`\``)

      let code = ctx.args.join(" ")
      if (!code) return ctx.message.channel.send('Please, write something so I can execute it!')
      try {
        let evaled = require('child_process').execSync(code).toString();
        if (evaled && evaled instanceof Promise) evaled = await evaled;
        if (typeof evaled !== "string") evaled = inspect(evaled, { depth: 0 });
        let evalEmbeds = stringTools.toChunks(evaled, 1000).map(thing => new ctx.MessageEmbed()
            .setColor('8fff8d')
            .addField('Result', dscformat('js', thing))
            .addField('Type', dscformat('css', typeof evaled === 'undefined' ? 'Unknown' : typeof evaled)));
        // if (ctx.flags.includes("noreply")) return;
        ctx.pagify(evalEmbeds, { xReact: true });
      } catch (err) {
        const embed = new ctx.MessageEmbed()
          .addField('Error', dscformat('js', err))
          .setColor('#ff5d5d')
        ctx.message.channel.send(embed);
      }
    }
}

module.exports = ExecuteCMD;