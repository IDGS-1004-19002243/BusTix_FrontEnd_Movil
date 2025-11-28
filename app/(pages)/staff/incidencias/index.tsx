import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Pressable, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import api from '@/services/auth/interceptors';
import { Plus, AlertCircle, Clock, CheckCircle2, XCircle, ChevronRight, MapPin, ChevronDown } from 'lucide-react-native';

interface Incidencia {
  incidenciaID: number;
  codigoIncidencia: string;
  titulo: string;
  descripcion: string;
  prioridad: string;
  estatus: number;
  estatusNombre: string;
  tipoIncidenciaNombre: string;
  fechaReporte: string;
  viajeID?: number;
  codigoViaje?: string;
  ubicacion?: string;
}

interface Viaje {
  viajeID: number;
  codigoViaje: string;
  rutaNombre: string;
  ciudadOrigen: string;
  ciudadDestino: string;
  fechaSalida: string;
  unidadID: number;
  unidadPlacas: string;
  estatus: number;
}

export default function IncidenciasPage() {
  const router = useRouter();
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [viajeSeleccionado, setViajeSeleccionado] = useState<Viaje | null>(null);
  const [showViajesPicker, setShowViajesPicker] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargar viajes y seleccionar el en curso
      const viajesResp = await api.get('/viajes/mis-viajes', {
        params: { rol: 'Staff' }
      });
      
      const viajesData = viajesResp.data;
      setViajes(viajesData);
      
      const enCurso = viajesData.find((v: any) => 
        v.estatus === 2 || v.estatus === 3 // En Ruta o En Curso
      );
      
      setViajeSeleccionado(enCurso || (viajesData.length > 0 ? viajesData[0] : null));

      // Cargar mis incidencias
      const incResp = await api.get('/incidencias/mis-reportes');
      setIncidencias(incResp.data?.data || incResp.data || []);
    } catch (err) {
      console.error('Error cargando datos:', err);
      Alert.alert('Error', 'No se pudieron cargar las incidencias');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad?.toLowerCase()) {
      case 'crítica': return '#DC2626';
      case 'alta': return '#EA580C';
      case 'media': return '#F59E0B';
      case 'baja': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getEstatusIcon = (estatus: number) => {
    switch (estatus) {
      case 1: return <Clock size={16} color="#F59E0B" />; // Activo (legacy)
      case 17: return <Clock size={16} color="#F59E0B" />; // Abierta
      case 18: return <AlertCircle size={16} color="#3B82F6" />; // En Proceso
      case 19: return <CheckCircle2 size={16} color="#10B981" />; // Resuelta
      case 20: return <XCircle size={16} color="#6B7280" />; // Cerrada
      default: return null;
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 12, color: '#6B7280' }}>Cargando incidencias...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>Incidencias</Text>
        
        {/* Selector de Viaje */}
        <View style={{ marginTop: 12 }}>
          <Pressable
            onPress={() => setShowViajesPicker(!showViajesPicker)}
            style={{
              backgroundColor: '#F3F4F6',
              padding: 12,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color="#6B7280" />
              {viajeSeleccionado ? (
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                    {viajeSeleccionado.codigoViaje}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6B7280' }}>
                    {viajeSeleccionado.rutaNombre}
                  </Text>
                </View>
              ) : (
                <Text style={{ fontSize: 14, color: '#9CA3AF' }}>Selecciona un viaje</Text>
              )}
            </View>
            <ChevronDown size={18} color="#6B7280" />
          </Pressable>

          {showViajesPicker && (
            <View style={{ 
              marginTop: 8, 
              backgroundColor: '#fff', 
              borderRadius: 8, 
              borderWidth: 1, 
              borderColor: '#E5E7EB',
              maxHeight: 250,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4
            }}>
              <ScrollView>
                {viajes.map((viaje) => (
                  <Pressable
                    key={viaje.viajeID}
                    onPress={() => {
                      setViajeSeleccionado(viaje);
                      setShowViajesPicker(false);
                    }}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F3F4F6',
                      backgroundColor: viajeSeleccionado?.viajeID === viaje.viajeID ? '#EEF2FF' : '#fff'
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                          {viaje.codigoViaje}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                          {viaje.rutaNombre}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
                          {new Date(viaje.fechaSalida).toLocaleDateString('es-MX', { 
                            day: '2-digit', 
                            month: 'short', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Text>
                      </View>
                      {viaje.estatus === 2 || viaje.estatus === 3 ? (
                        <View style={{ 
                          backgroundColor: '#10B981', 
                          paddingHorizontal: 8, 
                          paddingVertical: 4, 
                          borderRadius: 12 
                        }}>
                          <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>EN CURSO</Text>
                        </View>
                      ) : null}
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4F46E5']} />}
      >
        {/* Botón crear incidencia */}
        <TouchableOpacity
          onPress={() => router.push('/(pages)/staff/incidencias/create')}
          activeOpacity={0.7}
          style={{
            backgroundColor: '#4F46E5',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
            REPORTAR INCIDENCIA
          </Text>
        </TouchableOpacity>

        {/* Lista de incidencias */}
        {incidencias.length === 0 ? (
          <View style={{ backgroundColor: '#fff', padding: 32, borderRadius: 12, alignItems: 'center' }}>
            <AlertCircle size={48} color="#D1D5DB" />
            <Text style={{ marginTop: 12, fontSize: 16, fontWeight: '600', color: '#6B7280' }}>
              No hay incidencias reportadas
            </Text>
            <Text style={{ marginTop: 4, fontSize: 14, color: '#9CA3AF', textAlign: 'center' }}>
              Presiona el botón de arriba para reportar tu primera incidencia
            </Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {incidencias.map((inc) => (
              <Pressable
                key={inc.incidenciaID}
                // @ts-ignore - Nueva ruta, TypeScript la reconocerá después del reinicio
                onPress={() => router.push(`/(pages)/staff/incidencias/${inc.incidenciaID}`)}
                style={({ pressed }) => ({
                  backgroundColor: '#fff',
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                {/* Header con código y prioridad */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280' }}>
                    {inc.codigoIncidencia}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View
                      style={{
                        backgroundColor: getPrioridadColor(inc.prioridad) + '15',
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ fontSize: 11, fontWeight: '600', color: getPrioridadColor(inc.prioridad) }}>
                        {inc.prioridad}
                      </Text>
                    </View>
                    {getEstatusIcon(inc.estatus)}
                  </View>
                </View>

                {/* Título */}
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
                  {inc.titulo}
                </Text>

                {/* Tipo */}
                <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 8 }}>
                  {inc.tipoIncidenciaNombre}
                </Text>

                {/* Viaje */}
                {inc.codigoViaje && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    <MapPin size={12} color="#9CA3AF" />
                    <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{inc.codigoViaje}</Text>
                  </View>
                )}

                {/* Footer */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' }}>
                  <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                    {new Date(inc.fechaReporte).toLocaleDateString('es-MX', { 
                      day: '2-digit', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 12, color: '#6B7280', fontWeight: '500' }}>
                      {inc.estatusNombre}
                    </Text>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
