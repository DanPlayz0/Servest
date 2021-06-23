/*
Logger class for easy and aesthetically pleasing console logging
*/
const chalk = require("chalk");
const moment = require("moment");

class Logger {
  static log (content, type = "log") {
    //return console.log(content); // To remove color.
    const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
    switch (type) {
      case "log": {
        return console.log(`${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `);
      }
      case "warn": {
        return console.log(`${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `);
      }
      case "error": {
        return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
      }
      case "unauthorized": {
        return console.log(`${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `);
      }
      case "debug": {
        return console.log(`${timestamp} ${chalk.green(type.toUpperCase())} ${content} `);
      }
      case "cmd": {
        return console.log(`${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`);
      }
      case "ready": {
        return console.log(`${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`);
      } 
      default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    } 
  }
}
module.exports = Logger;