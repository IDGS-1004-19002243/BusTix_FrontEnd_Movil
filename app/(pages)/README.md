# 📖 Guía para Crear Nuevas Páginas

Esta guía te explica cómo agregar nuevas páginas a tu aplicación y vincularlas al sidebar de navegación.

## 🚀 Pasos para Crear una Nueva Página

### 1. Crear la Carpeta y Archivo de la Página

Crea una nueva carpeta dentro de `app/(pages)/` con el nombre de tu página:

```
app/(pages)/mi-nueva-pagina/
  └── index.tsx
```

### 2. Plantilla para Nueva Página

Copia y pega este código en tu `index.tsx`:

```typescript
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function MiNuevaPaginaPage() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView style={{ flex: 1, padding: 24 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 8, color: '#111827' }}>
          Mi Nueva Página 🎉
        </Text>
        <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 32 }}>
          Descripción de tu nueva página
        </Text>
        
        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Sección 1
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            Contenido de tu sección aquí
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
```

### 3. Agregar al Menú del Sidebar

Edita el archivo `app/_config/menuData.ts` y agrega tu nueva página:

#### Opción A: Item Simple (sin submenú)

```typescript
{
  icon: TuIcono, // Importa el icono de lucide-react-native
  label: 'Mi Nueva Página',
  color: '#6B7280',
  active: false,
  route: '/(pages)/mi-nueva-pagina'
}
```

#### Opción B: Como Subitem de un Menú

```typescript
{
  icon: Folder,
  label: 'Mi Categoría',
  hasSubmenu: true,
  color: '#6B7280',
  active: false,
  key: 'mi-categoria',
  submenu: [
    { 
      label: 'Mi Nueva Página', 
      icon: Circle, 
      route: '/(pages)/mi-nueva-pagina' 
    }
  ]
}
```

### 4. ¡Listo! 🎉

Tu nueva página ya está lista. Al hacer clic en el item del sidebar, navegarás automáticamente a tu nueva página.

## 📁 Estructura de Carpetas

```
app/
├── (pages)/                    # Carpeta de páginas
│   ├── _layout.tsx            # Layout de las páginas
│   ├── home/
│   │   └── index.tsx
│   ├── users/
│   │   └── index.tsx
│   ├── settings/
│   │   └── index.tsx
│   └── mi-nueva-pagina/       # Tu nueva página
│       └── index.tsx
├── _components/               # Componentes internos
│   ├── Sidebar.tsx
│   └── _sidebar/
├── _config/
│   └── menuData.ts           # ⚙️ Aquí agregas items al menú
└── _types/
    └── sidebar.types.ts
```

## 🎨 Iconos Disponibles

Puedes usar cualquier icono de `lucide-react-native`. Ejemplos comunes:

```typescript
import {
  Home,
  User,
  Users,
  Settings,
  Calendar,
  FileText,
  Briefcase,
  Package,
  Shield,
  Bell,
  Mail,
  Heart,
  Star,
  Search,
  Plus,
  Edit,
  Trash,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  Menu,
  BarChart,
  PieChart,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CreditCard,
  MapPin,
  Phone,
  Camera,
  Image,
  Video,
  Music,
  Download,
  Upload,
  Cloud,
  Database,
  Server,
  Wifi,
  Lock,
  Unlock,
  Eye,
  EyeOff,
} from 'lucide-react-native';
```

## 🎯 Ejemplos Completos

### Ejemplo 1: Página de Dashboard

```typescript
// app/(pages)/dashboard/index.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function DashboardPage() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView style={{ flex: 1, padding: 24 }}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 32, color: '#111827' }}>
          Dashboard 📊
        </Text>
        
        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
          <View style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>Total Usuarios</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>1,234</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>Ventas</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>$12,345</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
```

En `menuData.ts`:
```typescript
import { BarChart3 } from 'lucide-react-native';

// ...
{
  icon: BarChart3,
  label: 'Dashboard',
  color: '#10B981',
  route: '/(pages)/dashboard'
}
```

### Ejemplo 2: Página de Perfil

```typescript
// app/(pages)/profile/index.tsx
import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';

export default function ProfilePage() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView style={{ flex: 1, padding: 24 }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 36, color: '#ffffff', fontWeight: 'bold' }}>JD</Text>
          </View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>John Doe</Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>john@example.com</Text>
        </View>
        
        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
            Información Personal
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
            Nombre: John Doe
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
            Email: john@example.com
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            Teléfono: +1 234 567 8900
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
```

En `menuData.ts`:
```typescript
import { User } from 'lucide-react-native';

// ...
{
  icon: User,
  label: 'Perfil',
  color: '#6B7280',
  route: '/(pages)/profile'
}
```

## 💡 Tips y Mejores Prácticas

1. **Nombres de Carpetas**: Usa kebab-case (minúsculas con guiones)
   - ✅ `mi-nueva-pagina`
   - ❌ `MiNuevaPagina` o `mi_nueva_pagina`

2. **Rutas**: Siempre usa el formato `/(pages)/nombre-pagina`

3. **Organización**: Si tienes muchas páginas relacionadas, crea subcarpetas:
   ```
   app/(pages)/
   ├── admin/
   │   ├── users/
   │   ├── roles/
   │   └── settings/
   └── public/
       ├── home/
       └── about/
   ```

4. **Colores Consistentes**: Usa la misma paleta de colores para items relacionados

5. **Iconos Significativos**: Elige iconos que representen claramente la función de la página

## 🔧 Solución de Problemas

### La página no aparece en el menú
- Verifica que agregaste el item en `menuData.ts`
- Asegúrate de que la ruta coincida exactamente

### Error al navegar
- Verifica que el archivo `index.tsx` existe en la carpeta correcta
- Asegúrate de que el componente exporta un default export

### El estilo no se ve bien
- Usa `ScrollView` para contenido largo
- Usa los colores del sistema: `#f9fafb` (fondo), `#111827` (texto), `#6b7280` (texto secundario)

## 📚 Recursos

- [Expo Router Docs](https://expo.github.io/router/docs/)
- [Lucide Icons](https://lucide.dev/icons/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
