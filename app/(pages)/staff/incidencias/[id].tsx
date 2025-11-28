import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '@/services/auth/interceptors';
import { ArrowLeft, MapPin, Clock, User } from 'lucide-react-native';

interface IncidenciaDetalle {
  incidenciaID: number;
  codigoIncidencia: string;
  titulo: string;
  descripcion: string;
  prioridad: string;
  estatus: number;
  estatusNombre: string;
  tipoIncidenciaID: number;
  tipoIncidenciaNombre: string;
  fechaReporte: string;
  viajeID?: number;
  codigoViaje?: string;
  unidadID?: number;
  unidadPlacas?: string;
  ubicacion?: string;
  reportadorNombre?: string;
  asignadoNombre?: string;
  fechaResolucion?: string;
  observaciones?: string;
}

interface TipoIncidencia {
  tipoIncidenciaID: number;
  nombre: string;
  categoria: string;
}

export default function IncidenciaDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [incidencia, setIncidencia] = useState<IncidenciaDetalle | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const incResp = await api.get(`/incidencias/${id}`);
      const incData = incResp.data?.data || incResp.data;
      setIncidencia(incData);
    } catch (err) {
      console.error('Error cargando incidencia:', err);
      Alert.alert('Error', 'No se pudo cargar la incidencia');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const getPrioridadColor = (p: string) => {
    switch (p?.toLowerCase()) {
      case 'crítica': return '#DC2626';
      case 'alta': return '#EA580C';
      case 'media': return '#F59E0B';
      case 'baja': return '#10B981';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!incidencia) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
              {incidencia.codigoIncidencia}
            </Text>
            <Text style={{ fontSize: 13, color: '#6B7280' }}>{incidencia.estatusNombre}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Modo Vista */}
        <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '600' }}>
                  {incidencia.tipoIncidenciaNombre}
                </Text>
                <View
                  style={{
                    backgroundColor: getPrioridadColor(incidencia.prioridad) + '15',
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: getPrioridadColor(incidencia.prioridad) }}>
                    {incidencia.prioridad}
                  </Text>
                </View>
              </View>

              <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 }}>
                {incidencia.titulo}
              </Text>

              <Text style={{ fontSize: 15, color: '#374151', lineHeight: 22 }}>
                {incidencia.descripcion}
              </Text>
            </View>

            {/* Detalles */}
            <View style={{ backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, gap: 12 }}>
              {incidencia.codigoViaje && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <MapPin size={18} color="#6B7280" />
                  <View>
                    <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Viaje</Text>
                    <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>
                      {incidencia.codigoViaje}
                    </Text>
                  </View>
                </View>
              )}

              {incidencia.ubicacion && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <MapPin size={18} color="#6B7280" />
                  <View>
                    <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Ubicación</Text>
                    <Text style={{ fontSize: 14, color: '#111827' }}>{incidencia.ubicacion}</Text>
                  </View>
                </View>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Clock size={18} color="#6B7280" />
                <View>
                  <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Reportado</Text>
                  <Text style={{ fontSize: 14, color: '#111827' }}>
                    {new Date(incidencia.fechaReporte).toLocaleString('es-MX')}
                  </Text>
                </View>
              </View>

              {incidencia.reportadorNombre && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <User size={18} color="#6B7280" />
                  <View>
                    <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Reportado por</Text>
                    <Text style={{ fontSize: 14, color: '#111827' }}>{incidencia.reportadorNombre}</Text>
                  </View>
                </View>
              )}
            </View>
      </ScrollView>
    </View>
  );
}
