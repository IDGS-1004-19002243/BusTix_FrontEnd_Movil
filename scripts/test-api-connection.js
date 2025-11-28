/**
 * Script para probar la conectividad con la API remota de BusTix
 * Ejecutar con: node scripts/test-api-connection.js
 */

const axios = require('axios');

// Configuración de la API
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://waldoz-001-site1.stempurl.com';
const API_ENDPOINTS = {
  login: '/api/account/login',
  status: '/api/account/status',
  tiposIncidencia: '/api/incidencias/tipos',
  misViajes: '/api/viajes/mis-viajes',
  viajes: '/api/viajes'
};

// Configurar axios para timeouts y logs
axios.defaults.timeout = 10000; // 10 segundos timeout
axios.defaults.baseURL = API_BASE_URL;

// Helper para colorear output en consola
const colors = {
  green: '\x1b[32m%s\x1b[0m',
  red: '\x1b[31m%s\x1b[0m',
  yellow: '\x1b[33m%s\x1b[0m',
  blue: '\x1b[36m%s\x1b[0m',
  reset: '\x1b[0m'
};

function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const color = {
    'INFO': colors.blue,
    'SUCCESS': colors.green,
    'ERROR': colors.red,
    'WARNING': colors.yellow
  }[level] || colors.reset;
  
  console.log(color, `[${timestamp}] ${level}: ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

// Función para probar conectividad básica
async function testConnectivity() {
  log('INFO', `Probando conectividad básica a ${API_BASE_URL}`);
  
  try {
    const response = await axios.get('/', { 
      timeout: 5000,
      validateStatus: () => true // Aceptar cualquier código de estado
    });
    
    log('SUCCESS', `Servidor respondió con código: ${response.status}`);
    log('INFO', 'Headers de respuesta:', {
      server: response.headers.server,
      'content-type': response.headers['content-type'],
      'x-powered-by': response.headers['x-powered-by']
    });
    
    return true;
  } catch (error) {
    log('ERROR', 'Error de conectividad:', {
      message: error.message,
      code: error.code,
      response: error.response?.status
    });
    return false;
  }
}

// Función para probar endpoint específico
async function testEndpoint(path, method = 'GET', data = null, headers = {}) {
  log('INFO', `Probando endpoint: ${method} ${path}`);
  
  try {
    const config = {
      method,
      url: path,
      headers,
      validateStatus: () => true // No fallar en códigos de error HTTP
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    
    log('SUCCESS', `Respuesta: ${response.status} ${response.statusText}`);
    
    // Mostrar información relevante de la respuesta
    if (response.data) {
      log('INFO', 'Datos de respuesta:', {
        type: typeof response.data,
        sample: typeof response.data === 'object' ? 
          Object.keys(response.data).slice(0, 5) : 
          String(response.data).substring(0, 100)
      });
    }
    
    return {
      success: response.status < 400,
      status: response.status,
      data: response.data,
      headers: response.headers
    };
    
  } catch (error) {
    log('ERROR', `Error en endpoint ${path}:`, {
      message: error.message,
      code: error.code,
      response: error.response?.status
    });
    return { success: false, error };
  }
}

// Función para probar autenticación
async function testAuthentication() {
  log('INFO', 'Probando endpoint de login con credenciales de prueba');
  
  const testCredentials = {
    email: 'staff@bustix.com',
    password: 'Staf@123456'
  };
  
  const result = await testEndpoint(API_ENDPOINTS.login, 'POST', testCredentials, {
    'Content-Type': 'application/json'
  });
  
  if (result.success && result.data?.isSuccess) {
    log('SUCCESS', 'Login exitoso - token recibido');
    return result.data.token;
  } else {
    log('WARNING', 'Login falló (esperado para credenciales de prueba):', {
      message: result.data?.message,
      isSuccess: result.data?.isSuccess
    });
    return null;
  }
}

// Función para probar endpoints con autenticación
async function testAuthenticatedEndpoints(token) {
  if (!token) {
    log('WARNING', 'No hay token disponible, probando endpoints sin autenticación');
    return;
  }
  
  const authHeaders = { 'Authorization': `Bearer ${token}` };
  
  log('INFO', 'Probando endpoints autenticados');
  
  // Probar endpoint de estado de cuenta
  await testEndpoint(API_ENDPOINTS.status, 'GET', null, authHeaders);
  
  // Probar endpoint de mis viajes
  await testEndpoint(API_ENDPOINTS.misViajes, 'GET', null, authHeaders);
}

// Función para probar endpoints públicos
async function testPublicEndpoints() {
  log('INFO', 'Probando endpoints públicos');
  
  // Probar tipos de incidencia (puede requerir auth)
  await testEndpoint(API_ENDPOINTS.tiposIncidencia);
  
  // Probar listado de viajes (puede requerir auth)
  await testEndpoint(API_ENDPOINTS.viajes);
}

// Función principal
async function runTests() {
  console.log('='.repeat(60));
  log('INFO', 'INICIANDO PRUEBAS DE CONECTIVIDAD API BUSTIX');
  console.log('='.repeat(60));
  
  // 1. Probar conectividad básica
  const isConnected = await testConnectivity();
  if (!isConnected) {
    log('ERROR', 'No se pudo conectar al servidor. Abortando pruebas.');
    process.exit(1);
  }
  
  console.log('\n' + '-'.repeat(40));
  
  // 2. Probar endpoints públicos
  await testPublicEndpoints();
  
  console.log('\n' + '-'.repeat(40));
  
  // 3. Probar autenticación
  const token = await testAuthentication();
  
  console.log('\n' + '-'.repeat(40));
  
  // 4. Probar endpoints autenticados
  await testAuthenticatedEndpoints(token);
  
  console.log('\n' + '='.repeat(60));
  log('INFO', 'PRUEBAS COMPLETADAS');
  console.log('='.repeat(60));
}

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  log('ERROR', 'Error no manejado:', reason);
  process.exit(1);
});

// Ejecutar las pruebas
runTests().catch(error => {
  log('ERROR', 'Error fatal en las pruebas:', error);
  process.exit(1);
});