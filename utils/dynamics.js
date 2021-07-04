const cron = require('node-cron');

module.exports = class DynamicChannels {
  constructor(client) {
    this.client = client;
  }

  async startup() {
    console.log("Cum")
    //cron.schedule('* * * * *', async () => {
    let guilds = await this.client.database.guilds.get();
    guilds.map(g => {
      g.channels.map(async (c, i) => {
        if (i > 1) return;
        let channel = await this.client.channels.cache.get(c.channelID)
        let res = await ctx.redis.get(`SERVBOT:${this.game}_${host}-${port || 'none'}`)
        if (res) {
          res = JSON.parse(res).state;
          return go(true);
        }
        Gamedig.query({ type: this.game, host, port: port || undefined }).then(async (state) => {
          await ctx.redis.setex(`SERVBOT:${this.game}_${host}-${port || 'none'}`, 60 * 5, JSON.stringify({ state, cached: new Date().toISOString() }));
          res = state
          return go(true, state);
        }).catch((error) => {
          return go(false);
        });
        function go(online = false, data = {}) {
          switch (c.type) {
            case 'players':
              channel.setName(`${state.players?.length || 0}/${state.maxplayers}`)
              break;
            case 'name':
              channel.setName(state.name)
              break;
            case 'map':
              channel.setName(state?.map || "No map found")
              break;
            case 'ping':
              channel.setName(state.ping || "Cant fetch ping for this gametype")
              break;
            case 'maxplayers':
              channel.setName(state.maxplayers)
              break;
            case 'gametype':
              channel.setName(state?.raw?.gametype || "Not supported for this game")
              break;
            case 'gamename':
              channel.setName(state?.raw?.gamename || "Not supported for this game")
              break;
          }
        }
      })
    })
    //})
  }
};