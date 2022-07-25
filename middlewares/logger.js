const winston = require('winston');
const { combine, timestamp, label, prettyPrint } = winston.format;

module.exports = (service) =>
  winston.createLogger({
    format: combine(
      label({ label: 'backend-service' }),
      timestamp(),
      prettyPrint()
    ),
    level: 'info',
    defaultMeta: { service: service },
    transports: [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
      })
    ]
  });
