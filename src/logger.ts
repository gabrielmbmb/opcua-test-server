/* eslint no-param-reassign: 0 */
import logger from 'winston';

export default function configureLogger(level: string): void {
  const transports = [
    new logger.transports.Console({
      format: logger.format.combine(
        logger.format(info => {
          info.level = info.level.toUpperCase();
          return info;
        })(),
        logger.format.colorize(),
        logger.format.timestamp(),
        logger.format.splat(),
        logger.format.printf(
          info => `[${info.timestamp}][${info.level}]: ${info.message}`
        )
      ),
    }),
  ];

  logger.configure({
    level: level.toLowerCase(),
    transports,
  });
}
