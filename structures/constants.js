module.exports = {
  REGEX: {
    ROLE_ID: /^[0-9]{16,19}$/,
    ROLE_MENTION: /^(?:<@&)([0-9]{16,19})(?:>)$/,
    USER_ID: /^[0-9]{16,19}$/,
    MEMBER_MENTION: /^(?:<@!?)?([0-9]{16,19})(?:>)?$/,
    REGEX: /[.*+?^${}()|[\]\\]/g,
    DOMAINS: /^https?:\/\/(www\.)?(pastebin|(gist\.)?github|gitlab)\.com\/\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?$/i
  },
  CLIENT_OPTIONS: {
    fetchAllMembers: false,
    partials: ["MESSAGE", "USER", "REACTION"],
    disableEveryone: true,
    messageCacheMaxSize: 100,
    messageCacheLifetime: 240,
    messageSweepInterval: 300,
    restTimeOffset: 60,
    intents: 32509, // All Intents: 32767
    ws: {
      large_threshold: 1000,
    }
  }
};

/*
    ws: {
      properties: {
        $os: 'browser',
        $browser: 'Discord iOS',
        $device: 'discord.js',
      }
    }

*/
