import { Variant, AddVariableOptions, DataType } from 'node-opcua';

let value = 10.0;

setInterval(() => {
  value += 1.0;
}, 3000);

const speed: AddVariableOptions = {
  nodeId: 'ns=1;s=FanSpeed',
  browseName: 'fanSpeed',
  dataType: 'Double',
  value: {
    get(): Variant {
      return new Variant({
        dataType: DataType.Double,
        value,
      });
    },
  },
};

export default speed;
