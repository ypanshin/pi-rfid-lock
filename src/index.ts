import { IAppConfig } from "./config";
import { Scanner } from "./manager/manager";
import rpio from 'rpio';
import { Gpio } from 'onoff';

const config: IAppConfig = require('../package.json').config;

const manager = new Scanner(config, rpio, Gpio);
manager.init();


// 1.It has to read the code
// 2.Read the cods that have access to open the lock 
// 3.If the code is on the list switch on green light for 5s and open the lock 
// 4.If the code is not on the list then switch on red light for 5s 
