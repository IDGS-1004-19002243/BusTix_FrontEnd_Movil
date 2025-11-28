import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet, Platform, Animated } from 'react-native';
import { useRouter, useLocalSearchParams, Redirect } from 'expo-router';
import { useSession } from '@/context/AuthContext';
import api from '@/services/auth/interceptors';
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface ScanNotification {
  type: NotificationType;
  message: string;
  timestamp: number;
}

export default function ScannerPage() {
  const { id } = useLocalSearchParams();
  const { isAuthenticated, user, isLoading: authLoading } = useSession();
  const router = useRouter();
  
  console.log('\n🎬 ════════════════════════════════════════');
  console.log('📱 SCANNER PAGE - Componente montado');
  console.log('════════════════════════════════════════');
  console.log('🆔 Viaje ID:', id);
  console.log('🔐 Autenticado:', isAuthenticated);
  console.log('👤 Usuario:', user?.email);
  console.log('🎭 Roles:', user?.roles);
  console.log('⏳ Auth Loading:', authLoading);
  console.log('🌐 API Base URL:', api.defaults.baseURL);
  console.log('════════════════════════════════════════\n');
  
  // Scanner state con expo-camera
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  
  // Notification state
  const [notification, setNotification] = useState<ScanNotification | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Viaje info
  const [viaje, setViaje] = useState<any>(null);
  const [loadingViaje, setLoadingViaje] = useState(true);
  const [stats, setStats] = useState({ total: 0, abordados: 0, pendientes: 0 });

  // Cargar info del viaje
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      
      console.log('🚀 SCANNER - Cargando información del viaje');
      console.log('🆔 Viaje ID:', id);
      
      try {
        console.log('📡 Llamando a /viajes/' + id + '/manifiesto');
        const resp = await api.get(`/viajes/${id}/manifiesto`);
        
        if (!mounted) {
          console.log('⚠️ Componente desmontado, cancelando actualización');
          return;
        }
        
        console.log('✅ Manifiesto cargado:', JSON.stringify(resp.data, null, 2).substring(0, 300));
        
        const data = resp.data;
        setViaje({
          codigoViaje: data.codigoViaje ?? data.CodigoViaje,
          rutaNombre: data.rutaNombre ?? data.RutaNombre,
        });
        setStats({
          total: data.totalPasajeros ?? data.TotalPasajeros ?? 0,
          abordados: data.pasajerosAbordados ?? data.PasajerosAbordados ?? 0,
          pendientes: data.pasajerosPendientes ?? data.PasajerosPendientes ?? 0,
        });
        
        console.log('📊 Stats configurados:', {
          total: data.totalPasajeros ?? data.TotalPasajeros ?? 0,
          abordados: data.pasajerosAbordados ?? data.PasajerosAbordados ?? 0,
          pendientes: data.pasajerosPendientes ?? data.PasajerosPendientes ?? 0,
        });
        
      } catch (err: any) {
        console.log('❌ Error cargando viaje');
        console.log('📝 Error:', err?.message);
        console.log('📊 Response:', err?.response?.data);
        console.warn('Error cargando viaje', err);
      } finally {
        if (mounted) {
          setLoadingViaje(false);
          console.log('✅ Loading viaje finalizado\n');
        }
      }
    };
    load();
    return () => { 
      mounted = false; 
      console.log('🔚 Scanner cleanup - componente desmontado\n');
    };
  }, [id]);



  // Mostrar notificación
  const showNotification = useCallback((type: NotificationType, message: string) => {
    setNotification({ type, message, timestamp: Date.now() });
    
    // Fade in
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setNotification(null);
    });
  }, [fadeAnim]);

  // Actualizar estadísticas
  const updateStats = useCallback(async () => {
    if (!id) return;
    
    console.log('🔄 Actualizando estadísticas del viaje...');
    
    try {
      const resp = await api.get(`/viajes/${id}/manifiesto`);
      const data = resp.data;
      
      const newStats = {
        total: data.totalPasajeros ?? data.TotalPasajeros ?? 0,
        abordados: data.pasajerosAbordados ?? data.PasajerosAbordados ?? 0,
        pendientes: data.pasajerosPendientes ?? data.PasajerosPendientes ?? 0,
      };
      
      setStats(newStats);
      
      console.log('✅ Stats actualizados:', newStats);
    } catch (err: any) {
      console.log('❌ Error actualizando stats:', err?.message);
      console.warn('Error actualizando stats', err);
    }
  }, [id]);

  // Manejar escaneo
  const handleBarCodeScanned = useCallback(async (result: BarcodeScanningResult) => {
    if (scanned || !id) return;
    
    setScanned(true);
    const data = result.data;
    
    console.log('═══════════════════════════════════════');
    console.log('🔍 SCANNER - Inicio de validación');
    console.log('═══════════════════════════════════════');
    console.log('📱 QR Escaneado:', data);
    console.log('🚌 Viaje ID:', id);
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    try {
      const payload = { 
        ViajeID: Number(id), 
        CodigoQR: data 
      };
      
      console.log('📤 Payload enviado:', JSON.stringify(payload, null, 2));
      console.log('🌐 Endpoint:', '/boletos/validar');
      console.log('⏳ Enviando request...');
      
      const resp = await api.post('/boletos/validar', payload);
      
      console.log('✅ Response recibida - Status:', resp.status);
      console.log('📦 Response data completa:', JSON.stringify(resp.data, null, 2));
      
      const respData = resp.data?.data ?? resp.data;
      const success = respData?.success ?? respData?.Success ?? resp.data?.success ?? true;
      const resultado = respData?.resultado ?? respData?.Resultado ?? resp.data?.resultado ?? '';
      const message = respData?.mensaje ?? respData?.Mensaje ?? resp.data?.message ?? respData?.Message ?? 'Boleto validado correctamente';
      
      console.log('💬 Mensaje extraído:', message);
      console.log('🎯 Success:', success);
      console.log('📋 Resultado:', resultado);
      
      // Determinar tipo de notificación basado en la respuesta
      const msgLower = message.toLowerCase();
      
      if (success && (resultado === 'Aprobado' || resultado === 'aprobado')) {
        // ✅ VERDE: Validación exitosa
        console.log('✅ VALIDACIÓN EXITOSA - Color VERDE');
        showNotification('success', message);
      } else if (msgLower.includes('ya fue validado') || 
                 msgLower.includes('ya registrada') ||
                 msgLower.includes('repetido') ||
                 msgLower.includes('duplicado') ||
                 msgLower.includes('ya validado') ||
                 resultado === 'Rechazado') {
        // ⚠️ AMARILLO: Ya fue usado/validado previamente
        console.log('⚠️ BOLETO YA VALIDADO - Color AMARILLO');
        showNotification('warning', message);
      } else {
        // Por defecto mostrar como éxito si no hay indicadores de error
        console.log('✅ VALIDACIÓN OK - Color VERDE');
        showNotification('success', message);
      }
      
      console.log('═══════════════════════════════════════\n');
      await updateStats();
      
    } catch (err: any) {
      console.log('❌ ERROR en validación');
      console.log('─────────────────────────────────────');
      console.log('🔴 Error completo:', err);
      console.log('📊 Error response:', err?.response);
      console.log('📝 Error data:', JSON.stringify(err?.response?.data, null, 2));
      console.log('🔢 Status code:', err?.response?.status);
      console.log('📋 Headers:', err?.response?.headers);
      console.log('🌐 Config URL:', err?.config?.url);
      console.log('🔑 Config baseURL:', err?.config?.baseURL);
      console.log('📤 Config data:', err?.config?.data);
      console.log('🔐 Auth header:', err?.config?.headers?.Authorization);
      
      const errorData = err?.response?.data;
      const errorMsg = errorData?.message || errorData?.Message || errorData?.mensaje || errorData?.Mensaje || 'Error al validar boleto';
      
      console.log('💬 Mensaje de error extraído:', errorMsg);
      
      // Determinar tipo de error por color:
      // AMARILLO: Ya fue validado/usado anteriormente
      // ROJO: No existe o no pertenece al viaje
      const errLower = errorMsg.toLowerCase();
      
      if (errLower.includes('ya fue validado') || 
          errLower.includes('ya validado') ||
          errLower.includes('repetido') ||
          errLower.includes('duplicado') ||
          errLower.includes('ya registrad')) {
        console.log('⚠️ Tipo de error: YA VALIDADO - Color AMARILLO');
        showNotification('warning', errorMsg);
      } else if (errLower.includes('no pertenece') ||
                 errLower.includes('no corresponde') ||
                 errLower.includes('no encontrado') ||
                 errLower.includes('no existe') ||
                 errLower.includes('no reconoce') ||
                 errLower.includes('invalido') ||
                 errLower.includes('inválido')) {
        console.log('🔴 Tipo de error: NO EXISTE/NO PERTENECE - Color ROJO');
        showNotification('error', errorMsg);
      } else {
        // Por defecto, errores generales en ROJO
        console.log('🔴 Tipo de error: GENERAL - Color ROJO');
        showNotification('error', errorMsg);
      }
      
      console.log('═══════════════════════════════════════\n');
    } finally {
      // Permitir nuevo escaneo después de 2 segundos
      setTimeout(() => setScanned(false), 2000);
    }
  }, [scanned, id, showNotification, updateStats]);

  if (authLoading || loadingViaje) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!isAuthenticated || !user?.roles?.includes('Staff')) {
    return <Redirect href="/sign-in" />;
  }

  // Web no soportado
  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <AlertCircle size={48} color="#EF4444" />
        <Text style={{ marginTop: 16, fontSize: 16, fontWeight: '600', color: '#111827' }}>
          Escáner no disponible
        </Text>
        <Text style={{ marginTop: 8, textAlign: 'center', color: '#6B7280', paddingHorizontal: 32 }}>
          El escáner de códigos QR requiere un dispositivo físico con cámara.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: 24, backgroundColor: '#4F46E5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Volver al Manifiesto</Text>
        </Pressable>
      </View>
    );
  }

  // Esperando permisos
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={{ marginTop: 16, color: '#6B7280' }}>Inicializando cámara...</Text>
      </View>
    );
  }

  // Sin permiso
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <AlertTriangle size={48} color="#F59E0B" />
        <Text style={{ marginTop: 16, fontSize: 16, fontWeight: '600', color: '#111827' }}>
          Permiso de cámara denegado
        </Text>
        <Text style={{ marginTop: 8, textAlign: 'center', color: '#6B7280', paddingHorizontal: 32 }}>
          Por favor habilita los permisos de cámara para usar el escáner.
        </Text>
        <Pressable
          onPress={requestPermission}
          style={{ marginTop: 24, backgroundColor: '#4F46E5', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Habilitar Cámara</Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          style={{ marginTop: 12, paddingHorizontal: 24, paddingVertical: 12 }}>
          <Text style={{ color: '#6B7280', fontWeight: '600' }}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Scanner View con expo-camera */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Overlay con info */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{viaje?.codigoViaje || 'Escaneando...'}</Text>
            <Text style={styles.headerSubtitle}>{viaje?.rutaNombre}</Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color="#fff" />
          </Pressable>
        </View>

        {/* Scan Frame */}
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
          
          <Text style={styles.scanText}>
            {scanned ? '⏳ Validando...' : '📱 Apunta al código QR del boleto'}
          </Text>
        </View>

        {/* Stats Footer */}
        <View style={styles.footer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.abordados}</Text>
            <Text style={styles.statLabel}>Validados</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.pendientes}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
        </View>
      </View>

      {/* Notification Toast */}
      {notification && (
        <Animated.View 
          style={[
            styles.notification,
            {
              backgroundColor: 
                notification.type === 'success' ? '#10B981' :
                notification.type === 'warning' ? '#F59E0B' :
                notification.type === 'error' ? '#EF4444' : '#3B82F6',
              opacity: fadeAnim,
            }
          ]}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {notification.type === 'success' && <CheckCircle size={24} color="#fff" />}
            {notification.type === 'warning' && <AlertTriangle size={24} color="#fff" />}
            {notification.type === 'error' && <AlertCircle size={24} color="#fff" />}
            <Text style={styles.notificationText}>{notification.message}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    alignSelf: 'center',
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#fff',
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  scanText: {
    position: 'absolute',
    bottom: -40,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    paddingBottom: 32,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  notification: {
    position: 'absolute',
    top: 100,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
});
