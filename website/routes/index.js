const { Router } = require("express");

const Discord = require('discord.js');

const route = Router();

route.get('/invite', async (req, res, next) => {
  res.redirect(process.env.BOT_INVITE);
});

route.get('/support', async (req, res, next) => {
  res.redirect(process.env.SUPPORT_INVITE);
});

route.get('/stats', async (req, res, next) => {
  let redisStats = await req.redis.get(`SERVBOTAPI:stats`);
  if(req.query.forceCache) redisStats = null;
  if(redisStats) redisStats = JSON.parse(redisStats)
  else {
    const guildCount = await req.client.shard.fetchClientValues('guilds.cache.size')
    const ping = await req.client.shard.fetchClientValues('ws.ping')
    const users = await req.client.shard.broadcastEval(() => this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));
    
    let shards = [];
    guildCount.map((count, shardId) => {
      shards.push({
        id: shardId, 
        guilds: count,
        users: users[shardId], 
        ping: ping[shardId],
      })
    });
    redisStats = {
      version: {
        nodejs: process.version,
        discordjs: "v"+Discord.version,
      },
      shards: shards,
      total: {
        guilds: guildCount.reduce((servers, num) => num + servers, 0),
        users: users.reduce((users, num) => num + users, 0),
        ping: ping.reduce((users, num) => num + users, 0) / ping.length
      }
    };
    await req.redis.setex(`SERVBOTAPI:stats`, 10 * 60, JSON.stringify(redisStats))
  }
  res.json(redisStats)
});

module.exports = route;