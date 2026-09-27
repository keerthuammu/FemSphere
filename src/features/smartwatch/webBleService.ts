/**
 * Optional Web Bluetooth Service for Amazfit Bip U Pro.
 * Provides browser-level BLE GATT connection when running in Chromium-based browsers (Chrome / Edge).
 */

export interface WebBleVitals {
  heartRate: number | null;
  batteryLevel: number | null;
  deviceName: string;
  deviceId: string;
}

export class WebBleService {
  private device: any = null;
  private server: any = null;
  private hrCharacteristic: any = null;

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
  }

  public async requestDevice(): Promise<any> {
    if (!this.isSupported()) {
      throw new Error('Web Bluetooth is not supported in this browser.');
    }

    const nav = navigator as any;
    this.device = await nav.bluetooth.requestDevice({
      filters: [
        { namePrefix: 'Amazfit' },
        { namePrefix: 'Bip U' },
        { services: ['heart_rate'] }
      ],
      optionalServices: [
        'battery_service',
        'device_information',
        0xfee0, // Huami Basic Service
        0xfee1  // Huami Auth Service
      ]
    });

    return this.device;
  }

  public async connect(): Promise<any> {
    if (!this.device) {
      await this.requestDevice();
    }

    if (!this.device.gatt) {
      throw new Error('Device does not support GATT.');
    }

    this.server = await this.device.gatt.connect();
    return this.server;
  }

  public async discoverServices(): Promise<any[]> {
    if (!this.server) {
      await this.connect();
    }
    return await this.server.getPrimaryServices();
  }

  public async readData(): Promise<WebBleVitals> {
    if (!this.server || !this.server.connected) {
      await this.connect();
    }

    let batteryLevel: number | null = null;
    try {
      const batteryService = await this.server.getPrimaryService('battery_service');
      const batteryChar = await batteryService.getCharacteristic('battery_level');
      const val = await batteryChar.readValue();
      batteryLevel = val.getUint8(0);
    } catch (e) {
      console.warn('Battery service not readable over Web Bluetooth:', e);
    }

    let heartRate: number | null = null;
    try {
      const hrService = await this.server.getPrimaryService('heart_rate');
      const hrChar = await hrService.getCharacteristic('heart_rate_measurement');
      const hrVal = await hrChar.readValue();
      heartRate = this.parseHeartRate(hrVal);
    } catch (e) {
      console.warn('Heart rate characteristic not directly readable without notification:', e);
    }

    return {
      heartRate,
      batteryLevel,
      deviceName: this.device?.name || 'Amazfit Bip U Pro',
      deviceId: this.device?.id || 'WEB-BLE'
    };
  }

  public async subscribeToNotifications(onHeartRateUpdate: (hr: number) => void): Promise<void> {
    if (!this.server || !this.server.connected) {
      await this.connect();
    }

    try {
      const hrService = await this.server.getPrimaryService('heart_rate');
      this.hrCharacteristic = await hrService.getCharacteristic('heart_rate_measurement');
      await this.hrCharacteristic.startNotifications();
      this.hrCharacteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const val = event.target.value;
        const hr = this.parseHeartRate(val);
        if (hr !== null) {
          onHeartRateUpdate(hr);
        }
      });
    } catch (err) {
      console.warn('Could not subscribe to HR notifications on Web Bluetooth:', err);
    }
  }

  public disconnect(): void {
    if (this.device && this.device.gatt && this.device.gatt.connected) {
      this.device.gatt.disconnect();
    }
    this.server = null;
    this.device = null;
    this.hrCharacteristic = null;
  }

  private parseHeartRate(dataView: DataView): number | null {
    if (!dataView || dataView.byteLength < 2) return null;
    const flags = dataView.getUint8(0);
    const is16Bit = (flags & 0x01) !== 0;
    if (is16Bit && dataView.byteLength >= 3) {
      return dataView.getUint16(1, /*littleEndian=*/true);
    } else {
      return dataView.getUint8(1);
    }
  }
}

export const webBleService = new WebBleService();
