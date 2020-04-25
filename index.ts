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
      default: '5001',
      describe: 'Server port',
    })
    .option('log-level', {
      alias: 'll',
      default: 'DEBUG',
      describe: 'Log messages filter level',
      choices: ['ERROR', 'WARN', 'INFO', 'DEBUG'],
    })
    .option('cert-dir', {
      alias: 'cd',
      default: './certificates',
      describe: 'Directory where server will save the certificates',
    });

  const { endpoint, port, logLevel, certDir } = argv;

  const ENDPOINT = process.env.OPCUA_SERVER_ENDPOINT || endpoint;
  const PORT = process.env.OPCUA_SERVER_PORT || port;
  const LOG_LEVEL = process.env.OPCUA_SERVER_LOG_LEVEL || logLevel;
  const CERT_DIR = process.env.OPCUA_SERVER_CERT_DIR || certDir;

  // Configure logger
  configureLogger(LOG_LEVEL as string);

  // Create OPC UA server
  const server = new Server(ENDPOINT, parseInt(PORT, 10), CERT_DIR as string);
  server.startServer();
}

main();
