import {
  OPCUAServerOptions,
  SecurityPolicy,
  MessageSecurityMode,
  OPCUACertificateManager,
  OPCUAServer,
} from 'node-opcua';
import logger from 'winston';

export default class Server {
  private endpoint: string;

  private port: number;

  private server!: OPCUAServer;

  constructor(endpoint: string, port: number) {
    this.endpoint = endpoint;
    this.port = port;
  }

  public startServer(): void {
    const serverOptions: OPCUAServerOptions = {
      securityPolicies: [
        SecurityPolicy.Basic128,
        SecurityPolicy.Basic256,
        SecurityPolicy.Basic256Rsa15,
      ],
      securityModes: [
        MessageSecurityMode.None,
        MessageSecurityMode.Sign,
        MessageSecurityMode.SignAndEncrypt,
      ],
      port: this.port,
      resourcePath: this.endpoint,
      buildInfo: {
        buildDate: new Date(),
        buildNumber: '1234',
      },
      isAuditing: false,
      allowAnonymous: false,
    };

    // Create server
    this.server = new OPCUAServer(serverOptions);

    // Initialize server (setup address space, namespaces, nodes, etc)
    this.initialize();
  }

  public initialize(): void {
    logger.info('Server is been initialized...');

    this.server.initialize(() => {
      // Start the server
      this.server.start(() => {
        logger.info('Server has been started... (CTRL + C to stop)');
        const {
          endpointUrl,
        } = this.server.endpoints[0].endpointDescriptions()[0];
        logger.info(`Server endpoints: ${endpointUrl}`);
      });
    });
  }

  public constructAddressSpace() {
    const { addressSpace } = this.server.engine;
    const namespace = addressSpace.getOwnNamespace();
  }
}
