// ============================================================================
//  db.js  -  Acceso a datos (bitacora de operaciones)
//  >>> VERSION INSEGURA <<<
// ============================================================================
//
//  Este modulo simula una pequena base de datos donde se guarda una bitacora
//  de las operaciones de cifrado. Se usa el driver 'mysql' (JavaScript puro)
//  para que el analisis estatico reconozca el "sink" de SQL.
//
//  Nota didactica: no se necesita un MySQL real corriendo. Si la conexion
//  falla, la consulta se atrapa y el servicio sigue vivo; lo importante para
//  el laboratorio es que SAST/CodeQL detecten la INYECCION SQL en el codigo.

const mysql = require('mysql');
const config = require('./config');

let conexion = null;
try {
  conexion = mysql.createConnection(config.DATABASE_URL);
} catch (e) {
  conexion = null;
}

// [VULN-3] Inyeccion de SQL por concatenacion directa de entrada del usuario.
//   El parametro 'nombre' viaja SIN sanitizar dentro de la consulta.
//   Un atacante puede enviar:  ' OR '1'='1  y alterar la logica.
//   Lo detectan CodeQL (js/sql-injection) y Semgrep.
//   La solucion son consultas parametrizadas (placeholders '?').
//   CWE-89 (SQL Injection)
function buscarBitacora(nombre, callback) {
  const sql = "SELECT * FROM bitacora WHERE usuario = '" + nombre + "'";
  if (!conexion) {
    return callback(null, { sqlEjecutado: sql, filas: [] });
  }
  conexion.query(sql, function (err, filas) {
    if (err) {
      return callback(null, { sqlEjecutado: sql, filas: [], nota: err.code });
    }
    return callback(null, { sqlEjecutado: sql, filas: filas });
  });
}

module.exports = { buscarBitacora };
