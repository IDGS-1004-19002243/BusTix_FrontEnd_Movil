# BusTix_FrontEnd_Movil

Este repositorio contiene el Frontend del proyecto BusTix en su versión móvil, desarrollado con React Native y Expo.

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm (incluido con Node.js)
- Expo Go app (para pruebas en dispositivo físico)

## 🚀 Instalación

### Primera vez - Configuración inicial

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/IDGS-1004-19002243/BusTix_FrontEnd_Movil
   cd bustix
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

## 🏃 Ejecutar el Proyecto

### Comando recomendado (con limpieza de caché)
```bash
npx expo start -c
```
Este comando inicia el servidor de desarrollo y limpia la caché de Metro Bundler, útil cuando hay problemas de caché o después de cambios importantes.

### Otros comandos disponibles

#### Iniciar sin limpiar caché
```bash
npx expo start
```
Inicio normal del servidor de desarrollo.

#### Opciones de plataforma específica
```bash
npx expo start --ios          # Abre directamente en simulador iOS
npx expo start --android      # Abre directamente en emulador Android
npx expo start --web          # Abre en navegador web
```

## 📱 Probar en Dispositivo

### Opción 1: Dispositivo Físico
1. Instala **Expo Go** desde:
   - [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Ejecuta `npx expo start`

3. Escanea el código QR:
   - **iOS**: Usa la app de Cámara nativa
   - **Android**: Usa el lector QR dentro de Expo Go

### Opción 2: Emulador/Simulador
- **Android**: Presiona `a` en la terminal (requiere Android Studio configurado - [ver documentación](https://docs.expo.dev/workflow/android-studio-emulator/))
- **iOS**: Presiona `i` en la terminal (solo macOS)
- **Web**: Presiona `w` en la terminal

## 🌐 Tecnologías Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **NativeWind** - Estilos con Tailwind CSS
- **Expo Router** - Navegación basada en archivos
