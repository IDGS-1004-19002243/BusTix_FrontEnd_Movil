import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Platform } from 'react-native';
import CameraScanner from '../../../../../components/CameraScanner';
import { isBarcodeScannerAvailable } from '../../../../../components/checkBarcodeAvailable';

export default function IncidenciaScreen({ route, navigation }: any) {
  const { id } = route.params || {};
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoId, setTipoId] = useState<number | null>(null);
  const [scannerAvailable, setScannerAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    // En producción podríamos cargar el catálogo de tipos desde /api/incidencias/tipos
    if (Platform.OS === 'web') {
      setScannerAvailable(false);
      return;
    }

    isBarcodeScannerAvailable().then((available) => setScannerAvailable(available));
  }, []);

  const submit = async () => {
    if (!titulo || !descripcion || !tipoId) {
      Alert.alert('Datos incompletos', 'Por favor completa título, descripción y tipo.');
      return;
    }

    try {
      // Llamada al backend (usar token real en headers)
      const res = await fetch(`https://your-backend.example.com/api/incidencias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TipoIncidenciaID: tipoId, ViajeID: id, Titulo: titulo, Descripcion: descripcion, Prioridad: 'Media' })
      });

      if (res.ok) {
        Alert.alert('Incidencia creada', 'La incidencia fue creada exitosamente.');
        navigation.goBack();
      } else {
        const txt = await res.text();
        Alert.alert('Error', `Error creando incidencia: ${txt}`);
      }
    } catch (ex) {
      Alert.alert('Error', `${ex}`);
    }
  };

  const handleScanned = (data: string) => {
    Alert.alert('QR escaneado (simulado/real)', data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Reportar Incidencia - Viaje {id}</Text>
      <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
      <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} style={[styles.input, { height: 100 }]} multiline />
      <View style={{ marginBottom: 12 }}>
        <Text style={{ color: '#666' }}>Escanea el QR con la cámara para adjuntarlo a la incidencia.</Text>
      </View>

      <View style={{ flex: 1, width: '100%' }}>
        {scannerAvailable === null ? (
          <Text>Detectando soporte de cámara...</Text>
        ) : scannerAvailable === false ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>El escáner nativo no está disponible en este entorno.</Text>
            <Text>Prueba en un dispositivo físico con Expo Go o instala un cliente de desarrollo que incluya `expo-barcode-scanner`.</Text>
          </View>
        ) : (
          <CameraScanner onScanned={(d) => handleScanned(d)} onCancel={() => navigation.goBack()} />
        )}
      </View>

      <Button title="Enviar incidencia" onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  h1: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8 }
});
