class Reboot {
  constructor(client, database, model) {
    this.client = client;
    this.database = database;
    this.model = model;
  }

  /**
   * Gets the stored data
   */
  async get() {
    const guilddata = await this.model.findOne({}, { _id: false });
    if(guilddata) {
      return guilddata;
    } else {
      return new Error('No data could be found.');
    }
  }

  /**
   * Deletes the data
   */
  async delete() {
    return await this.model.findOneAndDelete({});
  }

  async update(data) {
    return await this.model.updateOne({}, {$set: data });
  }

  async ensure() {
    const guilddb = await this.model.findOne({}, { _id: false });
    if(!guilddb){
      let data = {
        rebooted: false
      };
      await new this.model(data).save();
      return true;
    }else{
      return false;
    }
  }
}

module.exports = Reboot;
