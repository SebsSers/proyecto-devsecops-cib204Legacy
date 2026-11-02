// ============================================================================
//  servidor.js  -  API REST del servicio de cifrado
//  CIB-204 Seguridad del Software - Universidad Cenfotec
//  >>> VERSION INSEGURA (rama inseguro) <<<
//
//  Endpoints:
//    GET  /salud       -> estado del servicio
//    GET  /llave       -> entrega la llave publica
//    POST /cifrar      -> cifra un texto
//    POST /descifrar   -> descifra un texto
//    GET  /buscar      -> consulta la bitacora (demostracion de SQLi)
//    POST /calcular    -> "utilidad" de calculo (demostracion de eval)
//    GET  /diagnostico -> ejecuta un ping (demostracion de command injection)
// ============================================================================

const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const cifrado = require('./cifrado');
const db = require('./db');
const config = require('./config');
const { requiereAuth } = require('./auth');

const app = express();
app.use(express.json());

// [VULN-5] CORS totalmente abierto: cualquier origen puede consumir la API.
//   Lo reporta OWASP ZAP (DAST) y Semgrep. La solucion es restringir a los
//   origenes de confianza.  CWE-942 (Overly Permissive CORS)
app.use(cors());

// [VULN-6] Faltan cabeceras de seguridad (no se usa Helmet):
//   sin Content-Security-Policy, X-Content-Type-Options, etc.
//   Lo reporta OWASP ZAP.  CWE-693 (Protection Mechanism Failure)
//   (La solucion es: app.use(require('helmet')()).)

// El servicio genera su par de llaves al arrancar.
const llaves = cifrado.generarLlaves();

app.get('/salud', (req, res) => {
  res.json({ estado: 'ok', version: 'inseguro-1.0' });
});

app.get('/llave', (req, res) => {
  res.json({ llavePublica: llaves.publicKey });
});

app.post('/cifrar', requiereAuth, (req, res) => {
  try {
    // [VULN-7] Sin validacion de entrada: no se controla tipo ni tamano.
    //   Un cuerpo enorme o de tipo inesperado puede tumbar el servicio.
    //   CWE-20 (Improper Input Validation)
    const texto = req.body.texto;
    const resultado = cifrado.cifrar(texto, llaves.publicKey);
    res.json({ cifrado: resultado });
  } catch (e) {
    // [VULN-8] Exposicion de detalles internos: se devuelve el stack al cliente.
    //   CWE-209 (Information Exposure Through an Error Message)
    res.status(500).json({ error: e.message, stack: e.stack });
  }
});

app.post('/descifrar', requiereAuth, (req, res) => {
  try {
    const cifradoTxt = req.body.cifrado;
    const resultado = cifrado.descifrar(cifradoTxt, llaves.privateKey);
    res.json({ descifrado: resultado });
  } catch (e) {
    res.status(500).json({ error: e.message, stack: e.stack });
  }
});

// Demostracion de INYECCION SQL (CWE-89).
app.get('/buscar', (req, res) => {
  const nombre = req.query.nombre || '';
  db.buscarBitacora(nombre, (err, data) => {
    res.json(data);
  });
});

// [VULN-9] Uso de eval() sobre entrada del usuario: inyeccion de codigo.
//   Lo detectan Semgrep y CodeQL (js/code-injection).
//   CWE-95 (Eval Injection)
app.post('/calcular', (req, res) => {
  const expresion = req.body.expresion || '0';
  try {
    const resultado = eval(expresion);
    res.json({ resultado });
  } catch (e) {
    res.status(400).json({ error: 'Expresion invalida' });
  }
});

// [VULN-10] Inyeccion de comandos del sistema operativo.
//   El parametro 'host' entra sin sanitizar a exec(). Un atacante puede enviar
//   "8.8.8.8; cat /etc/passwd". Lo detectan CodeQL y Semgrep.
//   CWE-78 (OS Command Injection)
app.get('/diagnostico', (req, res) => {
  const host = req.query.host || '127.0.0.1';
  exec('ping -c 1 ' + host, (err, stdout, stderr) => {
    res.json({ salida: stdout, error: stderr });
  });
});

if (require.main === module) {
  app.listen(config.PUERTO, () => {
    console.log('Servicio de cifrado escuchando en el puerto ' + config.PUERTO);
    console.log('AUTH_ENABLED =', config.AUTH_ENABLED);
  });
}

module.exports = app;
