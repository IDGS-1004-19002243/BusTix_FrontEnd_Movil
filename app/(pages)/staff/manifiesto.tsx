import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Pressable, ScrollView } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import api from '@/services/auth/interceptors';
import { MapPin, Clock, Users, Bus, User } from 'lucide-react-native';

interface Viaje {
  viajeID: number;
  codigoViaje: string;
  rutaNombre: string;
  ciudadOrigen: string;
  ciudadDestino: string;
  fechaSalida: string;
  estatusNombre: string;
  asientosVendidos: number;
  cupoTotal: number;
  unidadPlacas?: string;
  choferNombre?: string;
  tipoViaje?: string;
  eventoNombre?: string;
  eventoDescripcion?: string;
  eventoRecinto?: string;
}

export default function StaffManifiestoPage() {
  const { isAuthenticated, user, isLoading } = useSession();
  const [loading, setLoading] = useState(true);
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const resp = await api.get('/viajes/mis-viajes');
        if (!mounted) return;
        const data = resp.data?.data ?? resp.data;
        const viajesArray = Array.isArray(data) ? data : [];
        
        // Normalizar a camelCase
        const normalized = viajesArray.map((v: any) => ({
          viajeID: v.viajeID ?? v.ViajeID,
          codigoViaje: v.codigoViaje ?? v.CodigoViaje,
          rutaNombre: v.rutaNombre ?? v.RutaNombre,
          ciudadOrigen: v.ciudadOrigen ?? v.CiudadOrigen,
          ciudadDestino: v.ciudadDestino ?? v.CiudadDestino,
          fechaSalida: v.fechaSalida ?? v.FechaSalida,
          estatusNombre: v.estatusNombre ?? v.EstatusNombre ?? 'N/A',
          asientosVendidos: v.asientosVendidos ?? v.AsientosVendidos ?? 0,
          cupoTotal: v.cupoTotal ?? v.CupoTotal ?? 0,
          unidadPlacas: v.unidadPlacas ?? v.UnidadPlacas,
          choferNombre: v.choferNombre ?? v.ChoferNombre,
          tipoViaje: v.tipoViaje ?? v.TipoViaje,
          eventoNombre: v.eventoNombre ?? v.EventoNombre,
          eventoDescripcion: v.eventoDescripcion ?? v.EventoDescripcion,
          eventoRecinto: v.eventoRecinto ?? v.EventoRecinto,
        }));
        
        setViajes(normalized);
      } catch (err) {
        console.warn('Error cargando viajes del staff', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'activo':
      case 'disponible':
        return '#10B981';
      case 'en curso':
      case 'en viaje':
        return '#3B82F6';
      case 'completado':
      case 'finalizado':
        return '#6B7280';
      case 'cancelado':
        return '#EF4444';
      default:
        return '#8B5CF6';
    }
  };

  if (isLoading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  }

  if (!isAuthenticated || !user?.roles?.includes('Staff')) {
    return <Redirect href="/sign-in" />;
  }

  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>
          Manifiesto de Abordaje
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
          Selecciona un viaje para ver el manifiesto
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {viajes.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <Text style={{ color: '#9CA3AF', fontSize: 14 }}>No tienes viajes asignados</Text>
          </View>
        ) : (
          viajes.map((v) => (
            <Pressable
              key={v.viajeID}
              onPress={() => router.push(`/staff/travel/${v.viajeID}`)}
              style={({ pressed }) => ({
                marginBottom: 16,
                backgroundColor: '#fff',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                opacity: pressed ? 0.7 : 1,
              })}>
              <>
                <View style={{ padding: 16 }}>
                  {(v.eventoNombre || v.eventoDescripcion || v.eventoRecinto) && (
                    <View style={{ marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
                      {v.eventoNombre && (
                        <Text style={{ fontWeight: '700', fontSize: 16, color: '#6366F1', marginBottom: 4 }}>{v.eventoNombre}</Text>
                      )}
                      {v.eventoDescripcion && (
                        <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>{v.eventoDescripcion}</Text>
                      )}
                      {v.eventoRecinto && (
                        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>📍 {v.eventoRecinto}</Text>
                      )}
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text style={{ fontWeight: '700', fontSize: 18, color: '#1F2937', flex: 1 }}>{v.rutaNombre || v.codigoViaje}</Text>
                    <View style={{ backgroundColor: statusColor(v.estatusNombre), paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 }}>
                      <Text style={{ color: '#ffffff', fontWeight: '600', fontSize: 12 }}>{v.estatusNombre || 'N/A'}</Text>
                    </View>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={{ marginLeft: 8, color: '#4B5563', fontSize: 15, fontWeight: '500' }}>{v.ciudadOrigen} → {v.ciudadDestino}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={{ marginLeft: 8, color: '#4B5563', fontSize: 14 }}>{formatDate(v.fechaSalida)} a las {formatTime(v.fechaSalida)}</Text>
                  </View>
                </View>

                <View style={{ borderTopWidth: 1, borderTopColor: '#E5E7EB', padding: 12, gap: 8 }}>
                  {/* Row 1: Pasajeros y Unidad */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 8 }}>
                      <Users size={18} color="#4F46E5" />
                      <View style={{ marginLeft: 8, flex: 1 }}>
                        <Text style={{ fontSize: 11, color: '#6B7280' }}>Pasajeros</Text>
                        <Text style={{ fontWeight: '600', color: '#111827', fontSize: 14 }}>{v.asientosVendidos}/{v.cupoTotal}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 8 }}>
                      <Bus size={18} color="#4F46E5" />
                      <View style={{ marginLeft: 8, flex: 1 }}>
                        <Text style={{ fontSize: 11, color: '#6B7280' }}>Unidad</Text>
                        <Text style={{ fontWeight: '600', color: '#111827', fontSize: 13 }} numberOfLines={1}>{v.unidadPlacas || 'N/A'}</Text>
                      </View>
                    </View>
                  </View>
                  {/* Row 2: Chofer y Tipo */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 8 }}>
                      <User size={18} color="#4F46E5" />
                      <View style={{ marginLeft: 8, flex: 1 }}>
                        <Text style={{ fontSize: 11, color: '#6B7280' }}>Chofer</Text>
                        <Text style={{ fontWeight: '600', color: '#111827', fontSize: 13 }} numberOfLines={1}>{v.choferNombre || 'N/A'}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 8 }}>
                      <MapPin size={18} color="#4F46E5" />
                      <View style={{ marginLeft: 8, flex: 1 }}>
                        <Text style={{ fontSize: 11, color: '#6B7280' }}>Tipo</Text>
                        <Text style={{ fontWeight: '600', color: '#111827', fontSize: 13 }} numberOfLines={1}>{v.tipoViaje || 'N/A'}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}
