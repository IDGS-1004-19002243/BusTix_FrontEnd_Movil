import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { useSession } from '@/context/AuthContext';
import api from '@/services/auth/interceptors';
import Seo from '@/components/helpers/Seo';
import { useRouter } from 'expo-router';
import { Check, Clock, MapPin, Bus, User, Users, AlertTriangle } from 'lucide-react-native';

type Viaje = {
  viajeID: number;
  codigoViaje: string;
  tipoViaje?: string;
  rutaNombre?: string;
  ciudadOrigen?: string;
  ciudadDestino?: string;
  fechaSalida: string;
  fechaLlegadaEstimada?: string;
  estatusNombre?: string;
  asientosVendidos?: number;
  cupoTotal?: number;
  unidadPlacas?: string;
  choferNombre?: string;
  totalParadas?: number;
  eventoNombre?: string;
  eventoDescripcion?: string;
  eventoRecinto?: string;
};

export default function StaffHome() {
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await api.get('/viajes/mis-viajes');
        if (!mounted) return;
        console.log('Respuesta mis-viajes:', resp.data);
        const data = resp.data?.data ?? resp.data;
        const viajesArray = Array.isArray(data) ? data : [];
        console.log('Viajes procesados:', viajesArray.length, viajesArray);
        setViajes(viajesArray);
      } catch (err) {
        console.warn('Error al cargar viajes:', err);
        if (mounted) {
          setError('No se pudieron cargar los viajes. Por favor, verifica tu conexión de red e intenta de nuevo.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, []);

  const statusColor = (estatusName?: string) => {
    if (!estatusName) return '#9CA3AF';
    const s = estatusName.toLowerCase();
    if (s.includes('programado') || s.includes('program')) return '#06b6d4';
    if (s.includes('en curso') || s.includes('en curso')) return '#f59e0b';
    if (s.includes('finalizado') || s.includes('finaliz')) return '#10b981';
    if (s.includes('cancel') || s.includes('cancelado')) return '#ef4444';
    return '#6366F1';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  return (
    <>
      <Seo title="Mis viajes" description="Lista de viajes asignados" />
      <ScrollView style={{ flex: 1, backgroundColor: '#F3F4F6' }} contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', marginBottom: 16, color: '#111827' }}>Mis Viajes Asignados</Text>

        {loading && <ActivityIndicator size="large" color="#4F46E5" />}

        {error && (
          <View style={{ padding: 20, alignItems: 'center', backgroundColor: '#FFFBEB', borderRadius: 10, flexDirection: 'row', borderWidth: 1, borderColor: '#FEE2E2' }}>
            <AlertTriangle size={24} color="#F87171" />
            <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: '#991B1B' }}>{error}</Text>
          </View>
        )}

        {!loading && !error && viajes.length === 0 && (
          <View style={{ padding: 20, alignItems: 'center', backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontSize: 16, color: '#4B5563' }}>No tienes viajes asignados por el momento.</Text>
          </View>
        )}

        {viajes.map((v) => (
          <Pressable
            key={v.viajeID}
            onPress={() => router.push(`/staff/travel/${v.viajeID}`)}
            style={{
              marginBottom: 16,
              backgroundColor: '#fff',
              borderRadius: 12,
              borderWidth: 1,
            borderColor: '#E5E7EB',
            }}>
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
        ))}
      </ScrollView>
    </>
  );
}
