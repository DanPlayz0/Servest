"use strict";

const Discord = require("discord.js");

/**
 * This class provides a object of options for the run method
 */

/* { totalLength, message, mentions, member, guild, author, channel, client, voiceChannel, level, prefix, database, query, args, discord, MessageEmbed, sendMessage } */
class CommandContext {
  /**
   * Available properties for this class
   * @param {*} options properties
   * @property `totalLength`
   * @property `message`
   * @property `member`
   * @property `guild`
   * @property `author`
   * @property `channel`
   * @property `client`
   * @property `voiceChannel`
   * @property `level`
   * @property `prefix`
   * @property `database`
   * @property `query`
   * @property `args`
   * @property `sendMessage`
   */
  constructor(options) {
    this.totalLength = options.totalLength;

    this.message = options.message;
    this.mentions = options.message.mentions;
    this.member = options.message.member;
    this.guild = options.message.guild;
    this.author = options.message.author;
    this.channel = options.message.channel;
    this.client = options.message.client;
    this.voiceChannel = this.member && this.member.voice && this.member.voice.channel;
    
    this.redis = this.client.redis;

    this.level = options.level;
    this.prefix = options.prefix;
    this.database = options.message.client.database;
    this.query = options.query;
    this.args = options.args;

    this.Discord = Discord;

    this.sendMessage = c => options.message.channel.send(c);
    this.MessageEmbed = Discord.MessageEmbed;

    this.pagify = this.pagify;

    this.flags = new (require("string-toolkit"))().parseOptions(this.message.content.split(" ")).flags
    this.parser = new (require("string-toolkit"))().parseOptions(this.message.content.split(" "))

  }

  async failEmbed(title = 'No title defined', message = 'No message defined', color = 'RED') {
    const val = new Discord.MessageEmbed().setTitle(title).setDescription(message).setColor(color);
    return await this.channel.send({embeds: [val] });
  }

  async pagination(embeds, options = {}) {
    if(typeof embeds !== 'object') throw TypeError('embeds must be typeof Object');
    if(!Array.isArray(embeds)) embeds = [embeds];

    let pages = embeds.length, currentPage = (options && options.currentPage) || 0;
    embeds.map((embed, i) => embed.setFooter(`Requested by ${this.message.author.username} • Page ${i+1} of ${pages}${embed?.footer?.text ? `\n${embed.footer.text}` : ''}`));

    let selectMenu = [];
    embeds.map((_a,i) => selectMenu.push({ label: `Page ${i+1}`, value: `page_${i}`, default: i == 0 }));
    selectMenu=selectMenu.slice(0,25)
    
    const buttons = [
      {
        type: 1,
        components: [
          { type: 3, custom_id: "pagination_pageselect", options: selectMenu, placeholder: "Choose a page", min_values: 1, max_values: 1, disabled: pages == 1 }
        ]
      },
      {
        type: 1,
        components: [
          { style: 1, type: 2, label: '◀', custom_id: 'pagination_prev', disabled: pages == 1 },
          { style: 4, type: 2, label: '🛑', custom_id: 'pagination_stop' },
          { style: 1, type: 2, label: '▶', custom_id: 'pagination_next', disabled: pages == 1 },
          { style: 4, type: 2, label: '❌', custom_id: 'pagination_delete' },
        ]
      },
      
    ];

    let msg;
    if(options.message) msg = await options.message.edit({embeds: [embeds[currentPage]], components: buttons});
    else msg = await this.message.channel.send({embeds: [embeds[currentPage]], components: buttons});

    const filter = (interaction) => interaction.customID.startsWith('pagination_') && interaction.user.id === this.message.author.id;
    const collector = msg.createMessageComponentInteractionCollector({ filter, time: 15000 });

    collector.on('end',()=>{
      buttons.map(row => row.components.map(btn => btn.disabled = true));
      msg.edit({embeds: [embeds[currentPage]], components: buttons});
    });
    collector.on("collect", async (button) => {
      collector.resetTimer();
      button.deferUpdate();

      function updateSelectMenu(cPage) {
        selectMenu = [];
        embeds.map((_a,i) => selectMenu.push({ label: `Page ${i+1}`, value: `page_${i}`, default: i == cPage }));
        selectMenu = selectMenu.slice(0,25);
        buttons.find(row => row.components.find(item => item.type == 3)).components.find(item => item.type == 3).options = selectMenu;
      }

      try {
        switch (button.customID) {
          case "pagination_pageselect": {
            currentPage = Number(button.values[0].slice('page_'.length));
            updateSelectMenu(currentPage);
            msg.edit({embeds: [embeds[currentPage]], components: buttons});
          } break;
          case "pagination_next": {
            currentPage++;
            if(currentPage == pages) currentPage = 0;
            updateSelectMenu(currentPage);
            msg.edit({embeds: [embeds[currentPage]], components: buttons});
          } break;
          case "pagination_stop": {
            collector.stop();
            buttons.map(row => row.components.map(btn => btn.disabled = true));
            msg.edit({embeds: [embeds[currentPage]], components: buttons})
          } break;
          case "pagination_prev": {
            --currentPage;
            if(currentPage == -1) currentPage = pages-1;
            updateSelectMenu(currentPage);
            msg.edit({embeds: [embeds[currentPage]], components: buttons});
          } break;
          case "pagination_delete": {
            collector.stop();
            msg.delete();
          } break;
        }
      } catch (err) {
        console.log(err.message);
      }
    });

    return msg;
  }

  async pagify(embeds, options) {
    let reactions = ["◀️", "⏹️", "▶️"];
    if(embeds.length == 1) reactions = ["⏹️"]
    
    if(options && typeof options !== 'object') throw Error(`options cannot be a ${typeof options} must be an object`)
    if(options && options.xReact == true) reactions.push("❌");

    let currentPage = (options && options.currentPage) || 0

    let pages = embeds.length;
    embeds[currentPage].setFooter(`Requested by ${this.message.author.username} • Page ${currentPage + 1} of ${pages}`);
    const queueEmbed = await this.message.channel.send({embeds: [embeds[currentPage]] });

    await Promise.all(reactions.map(r => queueEmbed.react(r)));
    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && this.message.author.id === user.id;
    const collector = queueEmbed.createReactionCollector(filter);

    collector.on("collect", async (reaction, user) => {
      try {
        switch (reaction.emoji.name) {
          case "▶️":
            if(!reactions.includes("▶️")) return;
            currentPage++;
            if(currentPage == pages) currentPage = 0;
            if(this.guild.me.permissions.has('MANAGE_MESSAGES')) reaction.users.remove(user.id);
            queueEmbed.edit({embeds: [embeds[currentPage].setFooter(`Requested by ${this.message.author.username} • Page ${currentPage + 1} of ${pages}`)]});
            break;
          case "⏹️":
            collector.stop();
            if(this.guild.me.permissions.has('MANAGE_MESSAGES')) {
              reaction.message.reactions.removeAll();
            } else {
              for(let r of queueEmbed.reactions.cache.filter(r => r.users.cache.has(this.client.user.id)).array()) await r.users.remove(this.client.user.id);
            }
            break;

          case "◀️":
            if(!reactions.includes("◀️")) return;
            --currentPage;
            if(currentPage == -1) currentPage = pages-1;
            if(this.guild.me.permissions.has('MANAGE_MESSAGES')) reaction.users.remove(user.id);
            queueEmbed.edit({embeds: [embeds[currentPage].setFooter(`Requested by ${this.message.author.username} • Page ${currentPage + 1} of ${pages}`)]});
            break;

          case "❌":
            if(!reactions.includes("❌")) return;
            collector.stop();
            queueEmbed.delete();
            break;
        }
      } catch (err) {
        console.log(err.message);
      }
    });
  }
}

module.exports = CommandContext;
