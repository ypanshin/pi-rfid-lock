
export interface IAppConfig {
    /**
     * the pin number that RFID module SCK pin connected to.
     */
    clock: number;
    /**
     * the pin number that RFID module MOSI pin connected to.
     */
    mosi: number;
    /**
     * the pin number that RFID module SDA pin connected to.
     */
    miso: number;
    /**
     * the pin number that RFID module MISO pin connected to.
     */
    client: number;
    /**
     * the pin number that RFID module RST pin connected to.
     */
    reset: number;
    /**
     * the GPIO that the relay connected to.
     */
    relayGpio: number;
    /**
     * the interval in ms to look fo a card near the RFID module.
     */
    scanCardInterval: number;
}
