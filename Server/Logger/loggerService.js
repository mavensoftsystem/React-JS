const pino = require('pino')

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

module.exports = pino(
  {
    customLevels: levels, // our defined levels
    useOnlyCustomLevels: true,
    level: 'http',
    prettyPrint: {
      colorize: false, // colorizes the log
      
      levelFirst: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss TT',
    
    },
  },
   pino.destination(`${__dirname}/logger.log`)
)