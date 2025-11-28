import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import { Redirect } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import CameraScanner from '../../../components/CameraScanner';
import api from '../../../services/auth/interceptors';

export default function StaffScanPage() {
  const { isAuthenticated, user, isLoading } = useSession();
  const [scanning, setScanning] = useState(false);
  const [viajes, setViajes] = useState<any[]>([]);
  const [selectedViaje, setSelectedViaje] = useState<number | null>(null);
  const [loadingViajes, setLoadingViajes] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await api.get('/viajes/mis-viajes');
        if (!mounted) return;
        const data = resp.data?.data ?? resp.data;
        const viajesArray = Array.isArray(data) ? data : [];
        setViajes(viajesArray);
        // Auto-seleccionar el primer viaje si existe
        if (viajesArray.length > 0) {
          setSelectedViaje(viajesArray[0].ViajeID);
        }
      } catch (err) {
        console.warn('Error cargando viajes', err);
      } finally {
        if (mounted) setLoadingViajes(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleScanned = useCallback(async (data: string) => {
    if (!selectedViaje) {
      Alert.alert('Error', 'Selecciona un viaje primero');
      return;
    }
    setScanning(false);
    try {
      // DTO correcto: ValidacionDto
      const payload = { 
        ViajeID: selectedViaje, 
        CodigoQR: data 
      };
      const resp = await api.post('/boletos/validar', payload);
      const message = resp.data?.Message ?? resp.data?.message ?? 'Validación exitosa';
      Alert.alert('Resultado', message);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Error validando';
      Alert.alert('Error', msg);
    } finally {
      setTimeout(() => setScanning(true), 1500);
    }
  }, [selectedViaje]);

  if (isLoading || loadingViajes) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  }

  if (!isAuthenticated || !user?.roles?.includes('Staff')) {
    return <Redirect href="/sign-in" />;
  }

  if (viajes.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ fontSize: 16, textAlign: 'center' }}>No tienes viajes asignados.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {!scanning && (
        <View style={{ padding: 16, backgroundColor: '#f9fafb', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
          <Text style={{ fontWeight: '600', marginBottom: 8 }}>Selecciona el viaje:</Text>
          <FlatList
            horizontal
            data={viajes}
            keyExtractor={(item: any) => String(item.ViajeID)}
            renderItem={({ item }: any) => (
              <TouchableOpacity
                onPress={() => setSelectedViaje(item.ViajeID)}
                style={{
                  padding: 10,
                  marginRight: 8,
                  backgroundColor: selectedViaje === item.ViajeID ? '#10b981' : '#fff',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: selectedViaje === item.ViajeID ? '#10b981' : '#d1d5db',
                }}>
                <Text style={{ color: selectedViaje === item.ViajeID ? '#fff' : '#374151', fontWeight: '600' }}>
                  {item.CodigoViaje}
                </Text>
                <Text style={{ color: selectedViaje === item.ViajeID ? '#fff' : '#6b7280', fontSize: 12 }}>
                  {item.RutaNombre}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {scanning ? (
        <CameraScanner onScanned={handleScanned} onClose={() => setScanning(false)} />
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ marginBottom: 16 }}>Viaje seleccionado: {viajes.find(v => v.ViajeID === selectedViaje)?.CodigoViaje}</Text>
          <TouchableOpacity
            onPress={() => setScanning(true)}
            disabled={!selectedViaje}
            style={{
              backgroundColor: selectedViaje ? '#10b981' : '#d1d5db',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Abrir escáner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
