import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import api from '@/services/auth/interceptors';
import { ArrowLeft, Save, AlertTriangle, MapPin, ChevronDown } from 'lucide-react-native';

interface TipoIncidencia {
  tipoIncidenciaID: number;
  codigo: string;
  nombre: string;
  categoria: string;
  prioridad: string;
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
}

export default function CreateIncidenciaPage() {
  const router = useRouter();
  const { user } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tipos, setTipos] = useState<TipoIncidencia[]>([]);
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [showViajesPicker, setShowViajesPicker] = useState(false);
  const [showTiposPicker, setShowTiposPicker] = useState(false);

  // Form state
  const [viajeSeleccionado, setViajeSeleccionado] = useState<Viaje | null>(null);
  const [tipoID, setTipoID] = useState<number | null>(null);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('Media');
  const [ubicacion, setUbicacion] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Cargar tipos de incidencia y viajes en paralelo
      const [tiposResp, viajesResp] = await Promise.all([
        api.get('/incidencias/tipos'),
        api.get('/viajes/mis-viajes', { params: { rol: 'Staff' } })
      ]);
      
      setTipos(tiposResp.data?.data || tiposResp.data || []);
      const viajesData = viajesResp.data;
      setViajes(viajesData);
      
      // Seleccionar automáticamente el viaje en curso si existe
      const enCurso = viajesData.find((v: any) => 
        v.estatus === 2 || v.estatus === 3
      );
      setViajeSeleccionado(enCurso || (viajesData.length > 0 ? viajesData[0] : null));
    } catch (err) {
      console.error('Error cargando datos:', err);
      Alert.alert('Error', 'No se pudieron cargar los catálogos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!viajeSeleccionado) {
      Alert.alert('Error', 'Debes seleccionar un viaje');
      return;
    }
    if (!tipoID) {
      Alert.alert('Error', 'Selecciona un tipo de incidencia');
      return;
    }
    if (!titulo.trim()) {
      Alert.alert('Error', 'El título es requerido');
      return;
    }
    if (titulo.trim().length < 5) {
      Alert.alert('Error', 'El título debe tener al menos 5 caracteres');
      return;
    }
    if (!descripcion.trim()) {
      Alert.alert('Error', 'La descripción es requerida');
      return;
    }
    if (descripcion.trim().length < 10) {
      Alert.alert('Error', 'La descripción debe tener al menos 10 caracteres');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        TipoIncidenciaID: tipoID,
        ViajeID: viajeSeleccionado.viajeID,
        UnidadID: viajeSeleccionado.unidadID,
        Titulo: titulo.trim(),
        Descripcion: descripcion.trim(),
        Prioridad: prioridad,
        Ubicacion: ubicacion.trim() || undefined,
      };

      console.log('📤 Payload a enviar:', JSON.stringify(payload, null, 2));

      const resp = await api.post('/incidencias', payload);

      Alert.alert(
        'Éxito',
        'Incidencia reportada correctamente',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (err: any) {
      console.error('❌ Error creando incidencia:', err);
      console.error('Response data:', err?.response?.data);
      console.error('Response status:', err?.response?.status);
      
      let errorMsg = 'No se pudo crear la incidencia';
      
      if (err?.response?.data?.errors) {
        // Errores de validación del backend
        const errors = err.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMsg = errorMessages.join('\n');
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }
      
      Alert.alert('Error', errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </Pressable>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>Nueva Incidencia</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Selección de Viaje */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Viaje <Text style={{ color: '#DC2626' }}>*</Text>
          </Text>
          <Pressable
            onPress={() => setShowViajesPicker(!showViajesPicker)}
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flex: 1 }}>
              {viajeSeleccionado ? (
                <>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                    {viajeSeleccionado.codigoViaje}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                    {viajeSeleccionado.rutaNombre} • {viajeSeleccionado.unidadPlacas}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                    {new Date(viajeSeleccionado.fechaSalida).toLocaleDateString('es-MX', { 
                      day: '2-digit', 
                      month: 'short', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </>
              ) : (
                <Text style={{ fontSize: 15, color: '#9CA3AF' }}>Selecciona un viaje</Text>
              )}
            </View>
            <ChevronDown size={20} color="#6B7280" />
          </Pressable>
          
          {showViajesPicker && (
            <View style={{ 
              marginTop: 8, 
              backgroundColor: '#fff', 
              borderRadius: 8, 
              borderWidth: 1, 
              borderColor: '#E5E7EB',
              maxHeight: 300
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
                      backgroundColor: viajeSeleccionado?.viajeID === viaje.viajeID ? '#F0FDF4' : '#fff'
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                      {viaje.codigoViaje}
                    </Text>
                    <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                      {viaje.rutaNombre} • {viaje.unidadPlacas}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                      {new Date(viaje.fechaSalida).toLocaleDateString('es-MX', { 
                        day: '2-digit', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Tipo de Incidencia */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Tipo de Incidencia <Text style={{ color: '#DC2626' }}>*</Text>
          </Text>
          <Pressable
            onPress={() => setShowTiposPicker(!showTiposPicker)}
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flex: 1 }}>
              {tipoID ? (
                <>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                    {tipos.find(t => t.tipoIncidenciaID === tipoID)?.nombre}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                    {tipos.find(t => t.tipoIncidenciaID === tipoID)?.categoria}
                  </Text>
                </>
              ) : (
                <Text style={{ fontSize: 15, color: '#9CA3AF' }}>Selecciona un tipo</Text>
              )}
            </View>
            <ChevronDown size={20} color="#6B7280" />
          </Pressable>
          
          {showTiposPicker && (
            <ScrollView style={{ 
              marginTop: 8, 
              backgroundColor: '#fff', 
              borderRadius: 8, 
              borderWidth: 1, 
              borderColor: '#E5E7EB',
              maxHeight: 300
            }}>
                {tipos.map((tipo) => (
                  <Pressable
                    key={tipo.tipoIncidenciaID}
                    onPress={() => {
                      setTipoID(tipo.tipoIncidenciaID);
                      setShowTiposPicker(false);
                    }}
                    style={{
                      padding: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#F3F4F6',
                      backgroundColor: tipoID === tipo.tipoIncidenciaID ? '#EEF2FF' : '#fff'
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>
                      {tipo.nombre}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                      {tipo.categoria}
                    </Text>
                  </Pressable>
                ))}
            </ScrollView>
          )}
        </View>

        {/* Prioridad */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Prioridad <Text style={{ color: '#DC2626' }}>*</Text>
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Baja', 'Media', 'Alta', 'Crítica'].map((p) => (
              <Pressable
                key={p}
                onPress={() => setPrioridad(p)}
                style={{
                  flex: 1,
                  backgroundColor: prioridad === p ? '#4F46E5' : '#fff',
                  paddingVertical: 12,
                  paddingHorizontal: 4,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: prioridad === p ? '#4F46E5' : '#E5E7EB',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: prioridad === p ? '#fff' : '#6B7280' }}>
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Título */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Título <Text style={{ color: '#DC2626' }}>*</Text> (mínimo 5 caracteres)
          </Text>
          <TextInput
            value={titulo}
            onChangeText={setTitulo}
            placeholder="Ej: Falla en el aire acondicionado"
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              fontSize: 15,
              color: '#111827',
            }}
            maxLength={256}
          />
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
            {titulo.length}/256
          </Text>
        </View>

        {/* Descripción */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Descripción <Text style={{ color: '#DC2626' }}>*</Text> (mínimo 10 caracteres)
          </Text>
          <TextInput
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Describe detalladamente la incidencia..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              fontSize: 15,
              color: '#111827',
              minHeight: 120,
            }}
            maxLength={4000}
          />
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, textAlign: 'right' }}>
            {descripcion.length}/4000
          </Text>
        </View>

        {/* Ubicación */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Ubicación (Opcional)
          </Text>
          <TextInput
            value={ubicacion}
            onChangeText={setUbicacion}
            placeholder="Ej: Km 45 carretera federal, cerca de caseta"
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              fontSize: 15,
              color: '#111827',
            }}
            maxLength={200}
          />
        </View>

        {/* Botón guardar */}
        <Pressable
          onPress={handleSubmit}
          disabled={saving}
          style={{
            backgroundColor: saving ? '#9CA3AF' : '#4F46E5',
            paddingVertical: 14,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 20,
          }}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Save size={20} color="#fff" />
          )}
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            {saving ? 'Guardando...' : 'Reportar Incidencia'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
