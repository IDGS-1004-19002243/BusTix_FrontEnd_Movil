import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function HomePage() {
  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8, color: '#111827' }}>
        Bienvenido 👋
      </Text>
      <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 32 }}>
        Esta es la página de inicio de tu aplicación
      </Text>
        
        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            📊 Panel de Control
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            Aquí puedes ver el resumen de tu aplicación
          </Text>
        </View>

        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            🚀 Empezando
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 12 }}>
            Para agregar más páginas:
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
            1. Crea una carpeta en app/(pages)/nombre-pagina/
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
            2. Agrega un archivo index.tsx con tu componente
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>
            3. Actualiza app/_config/menuData.ts
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            4. ¡Listo! Tu nueva página aparecerá en el sidebar
          </Text>
        </View>
    </ScrollView>
  );
}
