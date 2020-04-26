import logger from 'winston';
import {
  Variant,
  AddVariableOptions,
  AddMethodOptions,
  DataType,
  SessionContext,
  MethodFunctorCallback,
  StatusCodes,
} from 'node-opcua';

let value = 10.0;

function setValue(newValue: number): void {
  value = newValue;
}

const setSpeed: AddMethodOptions = {
  browseName: 'setFanSpeed',
  inputArguments: [
    {
      name: 'speed',
      description: { text: 'Desired fan speed' },
      dataType: DataType.Double,
    },
  ],
  outputArguments: [
    {
      name: 'msg',
      description: { text: 'Verification message' },
      dataType: DataType.String,
    },
  ],
};

const accelerateFan = (
  inputArguments: Variant[],
  context: SessionContext,
  cb: MethodFunctorCallback
): void => {
  const speed = inputArguments[0].value;

  if (speed > value) {
    for (let i = value; i < speed; i += 0.5) {
      setTimeout(() => {
        logger.debug(`Accelerating fan to ${i}`);
        setValue(i);
      });
    }

    const callMethodResult = {
      statusCode: StatusCodes.Good,
      outputArguments: [
        {
          dataType: DataType.String,
          value: `Fan speed has been set to ${speed}`,
        },
      ],
    };

    cb(null, callMethodResult);
  } else if (speed < value) {
    for (let i = value; i > speed; i -= 0.5) {
      setTimeout(() => {
        logger.debug(`Deccelerating fan to ${i}`);
        setValue(i);
      });
    }

    const callMethodResult = {
      statusCode: StatusCodes.Good,
      outputArguments: [
        {
          dataType: DataType.String,
          value: `Fan speed has been set to ${speed}`,
        },
      ],
    };

    cb(null, callMethodResult);
  }
};

const fanSpeed: AddVariableOptions = {
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

export { fanSpeed, setSpeed, accelerateFan };
