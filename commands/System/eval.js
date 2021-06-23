"use strict";
const Command = require("@base/Command.js");
const stringTools = new (require("string-toolkit"))();
const { inspect } = require("util");

module.exports = class Eval extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: "Evaluates arbitrary Javascript.",
      category: "System",
      usage: "<expression>",
      aliases: ["evaluate"],
      botOwner: true,
      cooldown: 0
    });
  }

  async run(ctx) {
    const dscformat = (lang, value) => (`\`\`\`${lang}\n${value}\n\`\`\``).replace(new RegExp(ctx.client.token, 'g'), '*'.repeat(ctx.client.token.length))

    let code = ctx.args.filter(t => !ctx.flags.includes(t.replace(/--/g, ""))).join(" ").replace("```js", "").replace("```", "")
    if (!code) return ctx.message.channel.send('Please, write something so I can evaluate!')
    try {
      let evaled = ctx.flags.includes("async") ? eval(`(async () => {${code}})()`) : eval(code);
      if (evaled && evaled instanceof Promise) evaled = await evaled;
      if (typeof evaled !== "string") evaled = inspect(evaled, { depth: 0 });
      let evalEmbeds = stringTools.toChunks(evaled, 1000).map(thing => new ctx.MessageEmbed()
        .setColor('8fff8d')
        .addField('Result', dscformat('js', thing))
        .addField('Type', dscformat('css', typeof evaled === 'undefined' ? 'Unknown' : typeof evaled)));
      if (ctx.flags.includes("noreply")) return;
      ctx.pagify(evalEmbeds, { xReact: true });
    } catch (err) {
      const embed = new ctx.MessageEmbed()
        .addField('Error', dscformat('js', err))
        .setColor('#ff5d5d')
      ctx.pagify([embed], { xReact: true });
    }
  }
}
