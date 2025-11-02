import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function UsersPage() {
  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8, color: '#111827' }}>
        Usuarios 👥
      </Text>
      <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 32 }}>
        Gestiona los usuarios de tu aplicación
      </Text>
        
        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Lista de Usuarios
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            Aquí puedes ver y gestionar todos los usuarios
          </Text>
        </View>

        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Acciones
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            • Agregar nuevo usuario{'\n'}
            • Editar información{'\n'}
            • Eliminar usuarios{'\n'}
            • Ver detalles
          </Text>
        </View>
    </ScrollView>
  );
}
