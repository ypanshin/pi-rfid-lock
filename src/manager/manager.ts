import { Gpio, Direction, Edge, Options } from 'onoff';
import { IAppConfig } from '../config';
import { JsonBoxStorage } from '../services/storage/json-box.storage';
import * as Mfrc522 from 'mfrc522-rpi';
import * as SoftSPI from 'rpi-softspi';

/**
 * The scanner, checking the RFID module for the near chips.
 */
export class Scanner {

    private relayGpioReference?: Gpio;

    private mfrc522: Mfrc522;

    /**
     * @param onInterval - the interval to check the sensor when the relay is on (watering)
     * @param offInterval  - the interval to check the sensor when the relay is off
     */
    constructor(
        private config: IAppConfig,
        private rpio: Rpio,
        private Gpio: new (gpio: number, direction: Direction, edge?: Edge, options?: Options) => Gpio,
    ) {
        this.rpio.open(this.config.sensorPin, rpio.INPUT);

        const { clock, mosi, miso, client, reset } = config;
        const softSPI = new SoftSPI({
            clock,
            mosi,
            miso,
            client,
        });
        this.mfrc522 = new Mfrc522(softSPI)
            .setResetPin(reset);

        // switch off relay when Ctrl + C pressed
        process.on('SIGINT', _ => {
            if (this.relayGpioReference) {
                this.relayGpioReference.unexport();
            }
            process.exit();
        });
    }

    public async init() {
        setInterval(this.processInterval.bind(this), this.config.scanCardInterval);
    }

    private processInterval() {
        // reset card
        this.mfrc522.reset();

        // scan for cards
        let response = this.mfrc522.findCard();
        if (!response.status) {
            console.log("No Card");
            return;
        }
        console.log("Card detected, CardType: " + response.bitSize);

        // Get the UID of the card
        response = this.mfrc522.getUid();
        if (!response.status) {
            console.log("UID Scan Error");
            return;
        }
        // If we have the UID, continue
        const uid = response.data;
        console.log(
            "Card read UID: %s %s %s %s",
            uid[0].toString(16),
            uid[1].toString(16),
            uid[2].toString(16),
            uid[3].toString(16)
        );

        // Select the scanned card
        const memoryCapacity = this.mfrc522.selectCard(uid);
        console.log("Card Memory Capacity: " + memoryCapacity);

        //# This is the default key for authentication
        const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

        //# Authenticate on Block 8 with key and uid
        if (!this.mfrc522.authenticate(8, key, uid)) {
            console.log("Authentication Error");
            return;
        }

        //# Dump Block 8
        console.log("Block: 8 Data: " + this.mfrc522.getDataForBlock(8));

        //# Stop
        this.mfrc522.stopCrypto();
    }
}