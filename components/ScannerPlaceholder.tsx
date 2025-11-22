import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

type Props = {
  onSimulate?: (data: string) => void;
};

export default function ScannerPlaceholder({ onSimulate }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulador de Scanner</Text>
      <Text style={styles.info}>Utiliza este simulador para probar el flujo en Expo Go o web.</Text>
      <View style={styles.buttons}>
        <Button title="Simular QR válido" onPress={() => onSimulate?.('VALID_QR_12345')} />
        <Button title="Simular QR inválido" onPress={() => onSimulate?.('INVALID_QR_000')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  info: { textAlign: 'center', marginBottom: 16 },
  buttons: { width: '100%', gap: 8 }
});
