// ============================================================================
//  auth.js  -  Gestion de identidad y acceso (IAM)
//  >>> VERSION INSEGURA <<<
// ============================================================================
//
//  Middleware que deberia exigir un token JWT valido emitido por Keycloak.
//  En esta version esta debilitado a proposito.

const jwt = require('jsonwebtoken');
const config = require('./config');

// [VULN-4] Verificacion de JWT insegura.
//   - No se valida la firma con la llave publica de Keycloak.
//   - Se acepta el algoritmo 'none' y se decodifica sin verificar.
//   - El secreto de respaldo esta quemado (config.JWT_SECRET).
//   Un atacante puede fabricar un token con alg=none y entrar.
//   La solucion es validar la firma contra el JWKS del emisor y restringir
//   los algoritmos permitidos (RS256).
//   CWE-347 (Improper Verification of Cryptographic Signature) / CWE-287

function requiereAuth(req, res, next) {
  // Si el control de acceso esta apagado, deja pasar a cualquiera.
  if (!config.AUTH_ENABLED) {
    return next();
  }

  const cabecera = req.headers['authorization'] || '';
  const token = cabecera.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  try {
    // INSEGURO: decodifica sin verificar la firma y admite 'none'.
    const payload = jwt.decode(token) ||
      jwt.verify(token, config.JWT_SECRET, { algorithms: ['none', 'HS256'] });
    req.usuario = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'No autorizado' });
  }
}

module.exports = { requiereAuth };
