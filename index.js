require('dotenv').config();
// Include discord.js ShardingManger
const { ShardingManager } = require('discord.js');

// Create your ShardingManger instance
const manager = new ShardingManager('./serverbot.js', { totalShards: 'auto', token: process.env.TOKEN });
manager.on('shardCreate', (shard) => console.log(`Shard ${shard.id} launched`));
manager.spawn();

module.exports = manager;