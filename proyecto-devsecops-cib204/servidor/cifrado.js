// ============================================================================
//  cifrado.js  -  Modulo de cifrado RSA
//  CIB-204 Seguridad del Software - Universidad Cenfotec
//
//  >>> VERSION INSEGURA (rama inseguro) <<<
//  Este modulo contiene DEBILIDADES INTENCIONADAS con fines didacticos.
//  El objetivo del laboratorio es que el pipeline DevSecOps las detecte y
//  que el estudiante las corrija hasta dejar el proyecto "en verde".
//  Cada debilidad esta marcada con el comentario:  // [VULN-n]
// ============================================================================

const crypto = require('crypto');

// [VULN-1] Relleno (padding) inseguro y llave debil.
//   - Se usa RSA_PKCS1_PADDING (PKCS#1 v1.5), vulnerable a ataques de oraculo
//     de relleno (Bleichenbacher). El estandar recomienda OAEP.
//   - El tamano de llave (1024 bits) esta por debajo del minimo de 2048 bits
//     que exigen NIST SP 800-57 y OWASP.
//   CWE-326 (Inadequate Encryption Strength) / CWE-780 (Use of RSA without OAEP)
const TAMANO_LLAVE = 1024;
const RELLENO = crypto.constants.RSA_PKCS1_PADDING;

function generarLlaves() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: TAMANO_LLAVE,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKey, privateKey };
}

function cifrar(textoPlano, llavePublica) {
  const buffer = Buffer.from(String(textoPlano), 'utf8');
  const cifrado = crypto.publicEncrypt(
    { key: llavePublica, padding: RELLENO },
    buffer
  );
  return cifrado.toString('base64');
}

function descifrar(textoCifradoBase64, llavePrivada) {
  const buffer = Buffer.from(String(textoCifradoBase64), 'base64');
  const descifrado = crypto.privateDecrypt(
    { key: llavePrivada, padding: RELLENO },
    buffer
  );
  return descifrado.toString('utf8');
}

module.exports = { generarLlaves, cifrar, descifrar, TAMANO_LLAVE };
