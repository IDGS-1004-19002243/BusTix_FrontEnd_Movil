import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, Alert } from 'react-native';
import { useSearchParams, Redirect } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import api from '@/services/auth/interceptors';
import CameraScanner from '@/components/CameraScanner';

export default function ManifiestoPage() {
  const { id } = useSearchParams();
  const { isAuthenticated, user, isLoading: authLoading } = useSession();
  const [loading, setLoading] = useState(true);
  const [manifiesto, setManifiesto] = useState<any>(null);
  const [viaje, setViaje] = useState<any>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [viajeStarted, setViajeStarted] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [mResp, vResp] = await Promise.all([
          api.get(`/viajes/${id}/manifiesto`),
          api.get(`/viajes/${id}`)
        ]);
        if (!mounted) return;
        setManifiesto(mResp.data);
        setViaje(vResp.data);
        const started = (vResp.data?.Estatus ?? 0) > 2 || vResp.data?.VentasAbiertas === false;
        setViajeStarted(started);
      } catch (err) {
        console.warn('Error cargando manifiesto', err);
        Alert.alert('Error', 'No se pudo cargar el manifiesto');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  if (authLoading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  }

  if (!isAuthenticated || !user?.roles?.includes('Staff')) {
    return <Redirect href="/sign-in" />;
  }

  const handleStartTrip = useCallback(async () => {
    if (!id) return;
    Alert.alert('Confirmar', '¿Deseas comenzar el viaje? Esta acción cerrará ventas y deshabilitará el escaneo.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí, comenzar', onPress: async () => {
        try {
          await api.put(`/viajes/${id}`, { ventasAbiertas: false });
          setViajeStarted(true);
          Alert.alert('Listo', 'Viaje marcado como comenzado. El escaneo ahora está deshabilitado.');
        } catch (err: any) {
          console.warn('Error al comenzar viaje', err);
          Alert.alert('Error', err?.response?.data?.message || 'No se pudo comenzar el viaje');
        }
      }}
    ]);
  }, [id]);

  const handleScanned = useCallback(async (data: string) => {
    if (!id) {
      Alert.alert('Error', 'ID de viaje no disponible');
      return;
    }
    setScannerOpen(false);
    try {
      const payload = { ViajeID: Number(id), CodigoQR: data };
      const resp = await api.post('/boletos/validar', payload);
      const message = resp.data?.Message ?? resp.data?.message ?? (resp.data?.data?.Mensaje ?? 'Validación procesada');
      Alert.alert('Validación', message.toString());
      const mResp = await api.get(`/viajes/${id}/manifiesto`);
      setManifiesto(mResp.data);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Error validando boleto';
      Alert.alert('Error', msg.toString());
    }
  }, [id]);

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator /></View>;
  if (!manifiesto) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text>No hay manifiesto disponible.</Text></View>;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{`Manifiesto - ${manifiesto.CodigoViaje ?? manifiesto.ViajeID}`}</Text>
      <Text style={{ color: '#6b7280' }}>{`Salida: ${new Date(manifiesto.FechaSalida).toLocaleString()}`}</Text>

      <View style={{ flexDirection: 'row', marginTop: 12, justifyContent: 'space-between' }}>
        <View>
          <Text>Total pasajeros: {manifiesto.TotalPasajeros}</Text>
          <Text>Abordados: {manifiesto.PasajerosAbordados}</Text>
          <Text>Pendientes: {manifiesto.PasajerosPendientes}</Text>
        </View>
        <View>
          <Button title="Comenzar viaje" onPress={handleStartTrip} disabled={viajeStarted} />
          <View style={{ height: 8 }} />
          <Button title="Abrir escáner" onPress={() => setScannerOpen(true)} disabled={viajeStarted} />
        </View>
      </View>

      <Text style={{ marginTop: 16, fontWeight: '600', fontSize: 16 }}>Listado de Pasajeros</Text>
      <FlatList
        data={manifiesto.Pasajeros}
        keyExtractor={(item: any) => String(item.BoletoID)}
        renderItem={({ item }: any) => {
          const isAbordado = item.EstadoAbordaje === 'Abordado';
          const isPendiente = item.EstadoAbordaje === 'Pendiente';
          const bgColor = isAbordado ? '#d1fae5' : isPendiente ? '#fef3c7' : '#fee2e2';
          const borderColor = isAbordado ? '#10b981' : isPendiente ? '#f59e0b' : '#ef4444';
          
          return (
            <View style={{ 
              paddingVertical: 12, 
              paddingHorizontal: 12,
              marginVertical: 4,
              borderLeftWidth: 4, 
              borderLeftColor: borderColor,
              backgroundColor: bgColor,
              borderRadius: 6
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', fontSize: 15, flex: 1 }}>{item.ClienteNombre}</Text>
                <View style={{ 
                  backgroundColor: borderColor, 
                  paddingHorizontal: 8, 
                  paddingVertical: 4, 
                  borderRadius: 12 
                }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
                    {item.EstadoAbordaje || item.EstadoBoleto}
                  </Text>
                </View>
              </View>
              <Text style={{ color: '#374151', marginTop: 4 }}>
                {`🪑 Asiento: ${item.AsientoAsignado || 'Sin asignar'}`}
              </Text>
              {(item.ClienteEmail || item.ClienteTelefono) && (
                <Text style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>
                  {item.ClienteEmail || item.ClienteTelefono}
                </Text>
              )}
              {item.FechaValidacion && (
                <Text style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>
                  ✓ Validado: {new Date(item.FechaValidacion).toLocaleString()}
                </Text>
              )}
            </View>
          );
        }}
        style={{ marginTop: 8 }}
      />

      {scannerOpen && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <CameraScanner onScanned={handleScanned} onClose={() => setScannerOpen(false)} />
        </View>
      )}
    </View>
  );
}
