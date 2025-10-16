// BLE helper for Hydration Hero using Web Bluetooth API

const SERVICE_UUID = '8b9e0001-3c1d-4d8a-9f7e-2a1b1c0d0e0f';
const CHAR_UUID_INTAKE = '8b9e0002-3c1d-4d8a-9f7e-2a1b1c0d0e0f';

let connectedDevice: BluetoothDevice | null = null;
let connectedServer: BluetoothRemoteGATTServer | null = null;
let intakeCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

export function isBleSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.bluetooth;
}

export async function connectToHydrationBottle(): Promise<{ device: BluetoothDevice; server: BluetoothRemoteGATTServer; characteristic: BluetoothRemoteGATTCharacteristic }>
{
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [SERVICE_UUID] }],
    optionalServices: [SERVICE_UUID],
  });
  const server = await device.gatt!.connect();
  const service = await server.getPrimaryService(SERVICE_UUID);
  const characteristic = await service.getCharacteristic(CHAR_UUID_INTAKE);
  connectedDevice = device;
  connectedServer = server;
  intakeCharacteristic = characteristic;
  return { device, server, characteristic };
}

export async function startNotifications(
  characteristic: BluetoothRemoteGATTCharacteristic,
  onValue: (dataView: DataView) => void,
  onDisconnect?: () => void
) {
  characteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value!;
    onValue(value);
  });
  await characteristic.startNotifications();
  if (connectedDevice && onDisconnect) {
    connectedDevice.addEventListener('gattserverdisconnected', onDisconnect);
  }
}

export async function disconnectFromHydrationBottle() {
  try {
    await intakeCharacteristic?.stopNotifications();
  } catch {}
  if (connectedServer?.connected) {
    connectedServer.disconnect();
  }
  connectedDevice = null;
  connectedServer = null;
  intakeCharacteristic = null;
}


