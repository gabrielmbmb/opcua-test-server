import logger from 'winston';
import {
  Namespace,
  AddressSpace,
  UAObject,
  AddVariableOptions,
  AddMethodOptions,
  MethodFunctor,
} from 'node-opcua';

export default class Device {
  private addressSpace: AddressSpace;

  private namespace: Namespace;

  private name: string;

  private device: UAObject;

  constructor(namespace: Namespace, addressSpace: AddressSpace, name: string) {
    logger.debug(`Creating Device[${name}]`);
    this.namespace = namespace;
    this.addressSpace = addressSpace;
    this.name = name;
    this.device = this.namespace.addObject({
      organizedBy: addressSpace.rootFolder.objects,
      browseName: this.name,
    });
  }

  public addVariable(variable: AddVariableOptions): void {
    logger.debug(
      `Adding Variable[${variable.browseName}] to Device[${this.name}]`
    );
    this.namespace.addVariable({
      ...variable,
      ...{ componentOf: this.device },
    });
  }

  public addAndBindMethod(
    method: AddMethodOptions,
    bindMethod: MethodFunctor
  ): void {
    logger.debug(`Adding Method[${method.browseName}] to Device[${this.name}]`);
    const newMethod = this.namespace.addMethod(this.device, method);
    newMethod.bindMethod(bindMethod);
  }
}
