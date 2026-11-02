// Pruebas de INTEGRACION de la API (Jest + supertest)
const request = require('supertest');
const app = require('./servidor');

describe('API del servicio de cifrado', () => {
  test('GET /salud responde estado ok', async () => {
    const res = await request(app).get('/salud');
    expect(res.statusCode).toBe(200);
    expect(res.body.estado).toBe('ok');
  });

  test('GET /llave entrega la llave publica', async () => {
    const res = await request(app).get('/llave');
    expect(res.statusCode).toBe(200);
    expect(res.body.llavePublica).toContain('BEGIN PUBLIC KEY');
  });

  test('ciclo completo: /cifrar y luego /descifrar recupera el texto', async () => {
    const texto = 'Prueba de integracion';
    const c = await request(app).post('/cifrar').send({ texto });
    expect(c.statusCode).toBe(200);
    expect(c.body.cifrado).toBeDefined();

    const d = await request(app)
      .post('/descifrar')
      .send({ cifrado: c.body.cifrado });
    expect(d.statusCode).toBe(200);
    expect(d.body.descifrado).toBe(texto);
  });
});
