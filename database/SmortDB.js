module.exports = class SmortDB {
  constructor(client, database, model) {
    this.client = client;
    this.database = database;
    this.model = model;
    this.cache = [];

    // Functions
    this.getOne = this.getOne; 
    this.get = this.get;
    this.set = this.set;
    this.delete = this.delete;
    this.deleteAll = this.deleteAll;

    this._cache();
    this.cacher = setInterval(() => { this._cache() }, 5*60*1000)
  }

  async _cache() {
    this.cache = await this.get();
    return true;
  }

  /**
   * Gets a document
   * @param {Object} filter
   */
  async getOne(filter = {}) {
    return await this.model.findOne(filter, { _id: false });
  }

  /**
   * Gets many documents from db
   * @param {Object} data
   */
  async get(filter = {}) {
    return await this.model.find(filter, { _id: false });
  }

  /**
   * Creates a document
   * @param {Object} data
   */
  async set(data = {}) {
    return await new this.model(data).save();
  }

  /**
   * Updates a document in the db
   * @param {Object} filter
   * @param {Object} data
   */
  async update(filter = {}, data = {}) {
    if (filter == null) return new Error('filter not defined');
    return await this.model.updateOne(filter, {$set: data });
  }

  /**
   * Deletes a document from the db
   * @param {Object} filter
   */
  async delete(filter = {}) {
    return await this.model.findOneAndDelete(filter);
  }

  /**
   * Deletes many documents from the db
   * @param {Object} filter
   */
  async deleteAll(filter = {}) {
    return await this.modal.deleteMany(filter);
  }
}