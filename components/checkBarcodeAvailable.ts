export async function isBarcodeScannerAvailable(): Promise<boolean> {
  try {
    // Intentar carga dinámica
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('expo-barcode-scanner');
    return !!(mod && mod.BarCodeScanner);
  } catch (ex) {
    return false;
  }
}
