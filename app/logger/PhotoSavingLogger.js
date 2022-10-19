const { createLogger, format, transports } = require('winston');
const { combine, timestamp,label,printf} = format;
const DailyRotateFile = require('winston-daily-rotate-file');



const formatProduction = format.combine(
  format.timestamp(),
  format.printf(info => `${info.level}: ${info.timestamp}:${info.message}`),
);
const PhotoSavingLogger=()=>{
  var transport = new transports.DailyRotateFile({
    filename: 'logs/%DATE%/photosaving.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });
    return createLogger({
        level: 'debug',
        format: combine(
          label({ label: 'log' }),
            timestamp(),
            formatProduction
          ),
        transports: [
            new transports.Console(),
            // new transports.File({filename:"logger.log"}),
            transport
            
        ],
      });
}


module.exports =PhotoSavingLogger