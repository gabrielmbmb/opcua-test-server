import { AddVariableOptions, Variant, DataType } from 'node-opcua';

const value = true;

const on: AddVariableOptions = {
  nodeId: 'ns=1;s=FanOn',
  browseName: 'fanOn',
  dataType: 'Double',
  value: {
    get(): Variant {
      return new Variant({
        dataType: DataType.Boolean,
        value,
      });
    },
  },
};

export default on;
