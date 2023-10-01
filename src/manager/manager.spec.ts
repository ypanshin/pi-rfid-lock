import { mocked } from 'ts-jest/utils'
import { Gpio } from 'onoff';
import * as Rpio from 'rpio';
import { Manager } from './manager';

jest.mock('onoff');
jest.mock('rpio');
jest.useFakeTimers();

describe('watering', () => {
    let treeWaterer: Manager;

    beforeEach(() => {
        const mockedGpio= mocked(Gpio, true)
        const mockedRpio= mocked(Rpio, true)
        mockedGpio.mockReset();
        // mockedRpio.mockReset();
        treeWaterer = new Manager(1, 2, 100, 200, 1.5, Gpio, Rpio);
    });

    it('should switch on the relay when the moisture sensor is dry', () => {
        treeWaterer.relayOn()
        expect(setInterval).toHaveBeenCalledTimes(1);
    });

    it('should switch off the relay when the moisture sensor is wet', () => {

    });

    it('should set the interval to 1 sec when the relay is on', () => {

    });

    it('should set the interval to 1 min when the relay is off', () => {

    });
});