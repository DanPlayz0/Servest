const mongoose = require('mongoose');
const classes = require('./classes');

/**
 * The Database used by the client
 */
class Database {
  /**
   * This creates the database functions
   * @param {*} client
   * @property fn
   */
  constructor(client) {
    this.client = client;
    
    for (const i in classes) {
      this[i.toLowerCase()] = new classes[i](this.client, this, require(`./models/${i.toLowerCase()}.js`));
    }
  }
}

module.exports = Database;