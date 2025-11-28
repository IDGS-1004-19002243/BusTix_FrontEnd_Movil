// Test simple para validar decodificación JWT usando la misma lógica de jwtUtils.safeJwtDecode
// Uso: set JWT_TEST_TOKEN en env o pasar como primer argumento
const token = process.env.JWT_TEST_TOKEN || process.argv[2];
if (!token) {
  console.error('Usage: node safe-decode-test.js <JWT_TOKEN>');
  process.exit(1);
}

function safeJwtDecode(token) {
  const parts = token.split('.');
  if (parts.length < 2) throw new Error('Invalid JWT token');
  const payload = parts[1];
  const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4;
  const padded = pad ? b64 + '='.repeat(4 - pad) : b64;
  let json = '';
  if (typeof Buffer !== 'undefined' && typeof Buffer.from === 'function') {
    json = Buffer.from(padded, 'base64').toString('utf8');
  } else if (typeof atob === 'function') {
    const binary = atob(padded);
    json = decodeURIComponent(Array.prototype.map.call(binary, (c) => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  } else {
    throw new Error('No base64 decoder available in this environment');
  }
  return JSON.parse(json);
}

try {
  const decoded = safeJwtDecode(token);
  console.log('Decoded payload:');
  console.log(JSON.stringify(decoded, null, 2));
} catch (err) {
  console.error('Decode failed:', err.message || err);
  process.exit(2);
}
