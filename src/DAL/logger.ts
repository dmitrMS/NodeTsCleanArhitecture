import winston from 'winston';
import { cfg } from './config';
import { Request,Response,NextFunction } from 'express';

// настройка формата логгера
let format = winston.format.printf((info) => {
  let log = `${info.level}: ${info.message} | `;

  for (const property in info) {
    if (property !== 'level' && property !== 'message') {
      log += `${property}: ${info[property]}, `;
    }
  }

  return log;
});

// определение формата логирования
if (cfg.log.humanFriendly === false) {
  format = winston.format.json();
}

// создание логгера и настройка его параметров
export const logger = winston.createLogger({
  format: format,
  level: cfg.log.level,
  transports: [new winston.transports.Console()]
});

// функция для логирования запросов пользователей
export const logMiddleware = function (req:Request, res:Response, next:NextFunction) {
  const startTime = Date.now();

  res.on('finish', function () {
    logger.info('Request proccesed', {
      method: req.method,
      url: decodeURI(req.url),
      status: res.statusCode,
      latency: Date.now() - startTime
    });
  });

  next();
};
