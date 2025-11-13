import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Seo from '@/components/helpers/Seo';

export default function SettingsPage() {
  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24 }}
    >
      <Seo title="Configuración" description="Configura las preferencias de tu cuenta en BusTix." />
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8, color: '#111827' }}>
        Configuración ⚙️
      </Text>
      <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 32 }}>
        Personaliza tu aplicación
      </Text>
        
        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Preferencias
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            Configura las preferencias de tu cuenta
          </Text>
        </View>

        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Opciones
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            • Tema de la aplicación{'\n'}
            • Notificaciones{'\n'}
            • Idioma{'\n'}
            • Privacidad
          </Text>
        </View>
    </ScrollView>
  );
}
