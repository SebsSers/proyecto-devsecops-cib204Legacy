// Pruebas UNITARIAS del modulo de cifrado (Jest)
const cifrado = require('./cifrado');

describe('Modulo de cifrado RSA', () => {
  const llaves = cifrado.generarLlaves();

  test('cifrar devuelve un texto distinto del original (base64)', () => {
    const original = 'Hola CIB-204';
    const c = cifrado.cifrar(original, llaves.publicKey);
    expect(typeof c).toBe('string');
    expect(c).not.toBe(original);
    expect(c.length).toBeGreaterThan(0);
  });

  test('descifrar recupera el texto original (round-trip)', () => {
    const original = 'Mensaje seguro';
    const c = cifrado.cifrar(original, llaves.publicKey);
    const d = cifrado.descifrar(c, llaves.privateKey);
    expect(d).toBe(original);
  });

  test('genera un par de llaves en formato PEM', () => {
    expect(llaves.publicKey).toContain('BEGIN PUBLIC KEY');
    expect(llaves.privateKey).toContain('PRIVATE KEY');
  });
});
