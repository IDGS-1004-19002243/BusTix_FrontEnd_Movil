import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, Redirect } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import api from '@/services/auth/interceptors';
import Seo from '@/components/helpers/Seo';
import { QrCode, Users } from 'lucide-react-native';

interface Pasajero {
  boletoID: number;
  clienteNombre: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  asientoAsignado?: string;
  estadoAbordaje: string;
  estadoBoleto: string;
  fechaValidacion?: string;
}

interface ManifiestoData {
  viajeID: number;
  codigoViaje: string;
  fechaSalida: string;
  totalPasajeros: number;
  pasajerosAbordados: number;
  pasajerosPendientes: number;
  pasajeros: Pasajero[];
}

export default function TravelDetailPage() {
  const { id } = useLocalSearchParams();
  const { isAuthenticated, user, isLoading: authLoading } = useSession();
  const [loading, setLoading] = useState(true);
  const [manifiesto, setManifiesto] = useState<ManifiestoData | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const resp = await api.get(`/viajes/${id}/manifiesto`);
        if (!mounted) return;
        
        // Normalizar datos (puede venir en PascalCase o camelCase)
        const data = resp.data;
        setManifiesto({
          viajeID: data.viajeID ?? data.ViajeID,
          codigoViaje: data.codigoViaje ?? data.CodigoViaje,
          fechaSalida: data.fechaSalida ?? data.FechaSalida,
          totalPasajeros: data.totalPasajeros ?? data.TotalPasajeros ?? 0,
          pasajerosAbordados: data.pasajerosAbordados ?? data.PasajerosAbordados ?? 0,
          pasajerosPendientes: data.pasajerosPendientes ?? data.PasajerosPendientes ?? 0,
          pasajeros: (data.pasajeros ?? data.Pasajeros ?? []).map((p: any) => ({
            boletoID: p.boletoID ?? p.BoletoID,
            clienteNombre: p.clienteNombre ?? p.ClienteNombre ?? 'Sin nombre',
            clienteEmail: p.clienteEmail ?? p.ClienteEmail,
            clienteTelefono: p.clienteTelefono ?? p.ClienteTelefono,
            asientoAsignado: p.asientoAsignado ?? p.AsientoAsignado,
            estadoAbordaje: p.estadoAbordaje ?? p.EstadoAbordaje ?? 'Pendiente',
            estadoBoleto: p.estadoBoleto ?? p.EstadoBoleto ?? 'Activo',
            fechaValidacion: p.fechaValidacion ?? p.FechaValidacion,
          }))
        });
      } catch (err) {
        console.warn('Error al cargar manifiesto', err);
        Alert.alert('Error', 'No se pudo cargar el manifiesto del viaje');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  if (authLoading || loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  }

  if (!isAuthenticated || !user?.roles?.includes('Staff')) {
    return <Redirect href="/sign-in" />;
  }

  if (!manifiesto) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <Text style={{ fontSize: 16, color: '#6B7280' }}>No se encontró el manifiesto del viaje.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }} contentContainerStyle={{ paddingBottom: 20 }}>
      <Seo title={`Manifiesto - ${manifiesto.codigoViaje}`} description={`Manifiesto del viaje ${manifiesto.codigoViaje}`} />
      
      {/* Header */}
      <View style={{ backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
          Manifiesto de Abordaje
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280' }}>
          {manifiesto.codigoViaje}
        </Text>
        <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
          Salida: {new Date(manifiesto.fechaSalida).toLocaleString('es-MX', { 
            dateStyle: 'medium', 
            timeStyle: 'short' 
          })}
        </Text>
      </View>

      {/* Stats */}
      <View style={{ 
        backgroundColor: '#fff', 
        marginHorizontal: 16, 
        marginTop: 16, 
        padding: 16, 
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-around',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1
      }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#4F46E5' }}>{manifiesto.totalPasajeros}</Text>
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Total</Text>
        </View>
        <View style={{ width: 1, backgroundColor: '#E5E7EB' }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#10B981' }}>{manifiesto.pasajerosAbordados}</Text>
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Abordados</Text>
        </View>
        <View style={{ width: 1, backgroundColor: '#E5E7EB' }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#F59E0B' }}>{manifiesto.pasajerosPendientes}</Text>
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>Pendientes</Text>
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        onPress={() => router.push(`/(pages)/staff/travel/${id}/scanner`)}
        activeOpacity={0.7}
        style={{
          backgroundColor: '#4F46E5',
          marginHorizontal: 16,
          marginTop: 16,
          marginBottom: 8,
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          ESCANEAR BOLETOS
        </Text>
      </TouchableOpacity>

      {/* Pasajeros List Header */}
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingTop: 8,
        paddingBottom: 8 
      }}>
        <Users size={18} color="#6B7280" />
        <Text style={{ marginLeft: 8, fontSize: 15, fontWeight: '600', color: '#374151' }}>
          Listado de Pasajeros
        </Text>
      </View>

      {/* Pasajeros List */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        {manifiesto.pasajeros.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <Text style={{ color: '#9CA3AF', fontSize: 14 }}>No hay pasajeros registrados</Text>
          </View>
        ) : (
          manifiesto.pasajeros.map((item) => {
            const isAbordado = item.estadoAbordaje === 'Abordado';
            const isPendiente = item.estadoAbordaje === 'Pendiente';
            const bgColor = isAbordado ? '#D1FAE5' : isPendiente ? '#FEF3C7' : '#FEE2E2';
            const borderColor = isAbordado ? '#10B981' : isPendiente ? '#F59E0B' : '#EF4444';
            const statusText = item.estadoAbordaje || item.estadoBoleto;
            
            return (
              <View key={String(item.boletoID)} style={{ 
                backgroundColor: '#fff',
                marginVertical: 6,
                borderRadius: 10,
                borderLeftWidth: 4, 
                borderLeftColor: borderColor,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1
              }}>
                <View style={{ backgroundColor: bgColor, paddingHorizontal: 12, paddingVertical: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontWeight: '700', fontSize: 15, color: '#111827', flex: 1 }}>
                      {item.clienteNombre}
                    </Text>
                    <View style={{ 
                      backgroundColor: borderColor, 
                      paddingHorizontal: 10, 
                      paddingVertical: 5, 
                      borderRadius: 12 
                    }}>
                      <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
                        {statusText}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={{ marginTop: 6 }}>
                    <Text style={{ color: '#374151', fontSize: 13 }}>
                      🪑 Asiento: {item.asientoAsignado || 'Sin asignar'}
                    </Text>
                    {(item.clienteEmail || item.clienteTelefono) && (
                      <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 2 }}>
                        📱 {item.clienteTelefono || item.clienteEmail}
                      </Text>
                    )}
                    {item.fechaValidacion && (
                      <Text style={{ color: '#9CA3AF', fontSize: 11, marginTop: 2 }}>
                        ✓ Validado: {new Date(item.fechaValidacion).toLocaleString('es-MX', { 
                          dateStyle: 'short', 
                          timeStyle: 'short' 
                        })}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}
