import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Button, StyleSheet, Platform } from 'react-native';

type Props = {
  onScanned: (data: string) => void;
  onCancel?: () => void;
};

export default function CameraScanner({ onScanned, onCancel }: Props) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isNativeAvailable, setIsNativeAvailable] = useState<boolean | null>(null);
  const [BarCodeScannerModule, setBarCodeScannerModule] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === 'web') {
          setIsNativeAvailable(false);
          setHasPermission(false);
          return;
        }

        // Cargar dinámicamente el módulo nativo para evitar errores en entornos sin soporte
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
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Inicializando cámara...</Text>
      </View>
    );
  }

  if (!isNativeAvailable) {
    return (
      <View style={styles.center}>
        <Text>El escáner nativo no está disponible en este entorno.</Text>
        <Text>Prueba en un dispositivo físico con Expo Go o en un cliente de desarrollo que incluya `expo-barcode-scanner`.</Text>
        {onCancel ? <Button title="Cerrar" onPress={onCancel} /> : null}
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text>No hay acceso a la cámara. Por favor habilita permisos.</Text>
        {onCancel ? <Button title="Cerrar" onPress={onCancel} /> : null}
      </View>
    );
  }

  const BarCodeScanner = BarCodeScannerModule;

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject as any}
      />

      {scanned && (
        <View style={styles.overlay}>
          <TouchableOpacity onPress={() => setScanned(false)} style={styles.button}>
            <Text>Escanear nuevamente</Text>
          </TouchableOpacity>
          {onCancel ? (
            <TouchableOpacity onPress={onCancel} style={[styles.button, { marginTop: 8 }]}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  overlay: { position: 'absolute', bottom: 24, left: 20, right: 20, alignItems: 'center' },
  button: { backgroundColor: '#fff', padding: 12, borderRadius: 8 }
});
