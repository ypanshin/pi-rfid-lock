# PI RFID Lock
The electronic door lock with access by RFID card and pin code.

## Devices
- [Raspberry PI any model](https://amzn.to/3nE8tsk)
- [Relay JQC-3FF-S-Z](https://amzn.to/38jBsez)
- [RFID Sensor](https://amzn.to/3h5OksS)

## System Setup
![Diagram](docs/assets/img/diagram.png)

### Relay
Connect the relay to the Raspberry PI:
- VCC --> Pin 2 (5V)
- GND --> Pin 6 (Ground)
- IN  --> Pin 18 (GPIO 24)

### RFID Module
The SPI master driver is disabled by default on Raspbian. To enable it, use raspi-config, or ensure the line dtparam=spi=on isn't commented out in /boot/config.txt. When it is enabled then reboot your pi. If the SPI driver was loaded, you should see the device /dev/spidev0.0
Connect the RFID Module to Raspberry PI:
- SDA --> Pin 24 (GPIO8/CE0)
- SCK --> Pin 23 (GPIO11/SCKL)
- MOSI --> Pin 19 (GPIO10/MOSI)
- MISO --> Pin 21 (GPIO9/MISO)
- IRQ --> None
- GND --> Pin 9 (Ground)
- RST --> Pin 22 (GPIO5C3)
- 3.3V (VCC) --> Pin 1 (3V3)

### Application Installation on Raspberry PI
- `$ git clone https://github.com/ypanshin/pi-rfid-lock.git` - clone the repository
- `$ cd pi-rfid-lock` - navigate to the project folder
- `$ nano package.json` - update `config` section of `package.json`
```
"config": {
    "clock": 23, // the pin number that RFID module SCK pin connected to.
    "mosi": 19, // the pin number that RFID module MOSI pin connected to.
    "miso": 21, // the pin number that RFID module SDA pin connected to.
    "client": 24, // the pin number that RFID module MISO pin connected to.
    "reset": 22, // the pin number that RFID module RST pin connected to.

    "relayGpio": 18, // the GPIO that the relay connected to.

    "scanCardInterval": 500, // the interval in ms to look fo a card near the RFID module.
  },
```
- `$ npm i && npm run build && npm start` - install, build and run the application


### Run the application On Raspberry Pi At Startup
Running the application on boot:
```
sudo nano /etc/rc.local
```
On the line before `exit 0` write the following script, replacing `{path to application}` with the directory of your application.
```
su pi -c 'sudo npm start --prefix /home/pi/{path to application} < /dev/null &' 
```
Write out the lines to save them (CTRL-X) and then `$ sudo reboot` to restart your RPi

## Key Web Application
The Key is an Ionic / React application that opens the lock from the web browser by entering a pin configured in the admin application.

## Admin Web Application
The Admin is an Ionic / React application that displays the access log and configuration of the lock.