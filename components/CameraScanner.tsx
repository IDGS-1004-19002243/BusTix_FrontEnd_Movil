import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Platform } from 'react-native';

type CameraScannerProps = {
  onScanned: (data: string) => void;
  onCancel?: () => void;
};

export default function CameraScanner({ onScanned, onCancel }: CameraScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isNativeAvailable, setIsNativeAvailable] = useState<boolean | null>(null);
  const [BarCodeScannerModule, setBarCodeScannerModule] = useState<any | null>(null);

  useEffect(() => {
    // Cargar el módulo nativo de forma dinámica para evitar errores en web o en entornos donde
    // el módulo no esté disponible (ej. Expo Go sin compatibilidad). Si falla, usamos fallback.
    (async () => {
      try {
        // Evitar intentar en web
        if (Platform.OS === 'web') {
          setIsNativeAvailable(false);
          setHasPermission(false);
          return;
        }

        // Intentar require dinámico
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require('expo-barcode-scanner');
        setBarCodeScannerModule(mod.BarCodeScanner);

        if (mod?.BarCodeScanner?.requestPermissionsAsync) {
          const { status } = await mod.BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        } else {
          setHasPermission(false);
        }

        setIsNativeAvailable(true);
      } catch (ex) {
        console.warn('expo-barcode-scanner no disponible en este entorno:', ex?.message || ex);
        setIsNativeAvailable(false);
        setHasPermission(false);
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    onScanned(data);
  };

  if (isNativeAvailable === null) {
    return <View style={styles.center}><Text>Inicializando cámara...</Text></View>;
  }

  if (!isNativeAvailable) {
    return (
      <View style={styles.center}>
        <Text>El escáner nativo no está disponible en este entorno.</Text>
        <Text>Prueba en un dispositivo físico con Expo Go o en un cliente de desarrollo que incluya el módulo nativo `expo-barcode-scanner`.</Text>
        {onCancel ? <Button title="Cerrar" onPress={onCancel} /> : null}
      </View>
    );
  }

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Solicitando permiso de cámara...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No hay acceso a la cámara. Por favor habilita permisos.</Text>
        {onCancel ? <Button title="Cerrar" onPress={onCancel} /> : null}
      </View>
    );
  }

  // Si llegamos aquí, BarCodeScannerModule está cargado y hay permisos
  const BarCodeScanner = BarCodeScannerModule;

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject as any}
      />
      {scanned && (
        <View style={styles.overlay}>
          <Button title="Escanear nuevamente" onPress={() => setScanned(false)} />
          {onCancel ? <Button title="Cancelar" onPress={onCancel} /> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'absolute', bottom: 20, left: 20, right: 20 }
});
