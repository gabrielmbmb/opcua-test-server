import yargs from 'yargs';
import configureLogger from './src/logger';
import Server from './src/server';

function main(): void {
  const { argv } = yargs(process.argv)
    .option('endpoint', {
      alias: 'e',
      default: '/UA/test',
      describe: 'Endpoint where server will be listening',
    })
    .option('port', {
      alias: 'p',
      default: 5001,
      describe: 'Server port',
    })
    .option('log-level', {
      alias: 'll',
      default: 'DEBUG',
      describe: 'Log messages filter level',
      choices: ['ERROR', 'WARN', 'INFO', 'DEBUG'],
    });

  const { endpoint, port, logLevel } = argv;

  // Configure logger
  configureLogger(logLevel as string);

  // Create OPC UA server
  const server = new Server(endpoint, port);
  server.startServer();
}

main();
