// Prueba rapida por consola:  node prueba.js
const cifrado = require('./cifrado');

const llaves = cifrado.generarLlaves();
const original = 'Hola mundo seguro CIB-204';

const c = cifrado.cifrar(original, llaves.publicKey);
const d = cifrado.descifrar(c, llaves.privateKey);

console.log('Original :', original);
console.log('Cifrado  :', c.substring(0, 40) + '...');
console.log('Descifrado:', d);
console.log('coincide =', d === original);
