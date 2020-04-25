import { AddVariableOptions, Variant, DataType } from 'node-opcua';

const on: AddVariableOptions = {
  nodeId: 'ns=1;s=FanOn',
  browseName: 'fanOn',
};

export default on;
