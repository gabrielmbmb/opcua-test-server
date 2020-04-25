import logger from 'winston';
import {
  OPCUAServerOptions,
  SecurityPolicy,
  MessageSecurityMode,
  OPCUACertificateManager,
  OPCUAServer,
} from 'node-opcua';
import userManager from './userManager';
import Device from './device';
import fanSpeed from './variables/fan/speed';

export default class Server {
  private endpoint: string;

  private port: number;

  private certDir: string;

  private server!: OPCUAServer;

  constructor(endpoint: string, port: number, certDir: string) {
    this.endpoint = endpoint;
    this.port = port;
    this.certDir = certDir;
  }

  public startServer(): void {
    const serverOptions: OPCUAServerOptions = {
      securityPolicies: [SecurityPolicy.Basic256, SecurityPolicy.Basic256Rsa15],
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
      userManager,
      isAuditing: false,
      serverCertificateManager: new OPCUACertificateManager({
        automaticallyAcceptUnknownCertificate: true,
        rootFolder: this.certDir,
      }),
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
      this.constructAddressSpace();

      // Start the server
      this.server.start(() => {
        logger.info('Server has been started... (CTRL + C to stop)');
        const {
          endpointUrl,
        } = this.server.endpoints[0].endpointDescriptions()[0];
        logger.info(`Server main endpoint: ${endpointUrl}`);
      });
    });
  }

  public constructAddressSpace(): void {
    const { addressSpace } = this.server.engine;
    if (addressSpace !== null) {
      const namespace = addressSpace.getOwnNamespace();

      // Add devices to the server
      const fan = new Device(namespace, addressSpace, 'fan');
      fan.addVariable(fanSpeed);
    }
  }
}
