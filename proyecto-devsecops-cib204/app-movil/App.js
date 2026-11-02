// ============================================================================
//  App.js  -  Aplicacion movil (cliente) Expo / React Native
//  CIB-204 Seguridad del Software - Universidad Cenfotec
//
//  La app es el CLIENTE: envia texto al servicio de cifrado (Node.js) y
//  muestra el resultado cifrado y descifrado. El cifrado ocurre en el
//  servicio, no en el telefono.
// ============================================================================

import React, { useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, TextInput,
  TouchableOpacity, StyleSheet,
} from 'react-native';

export default function App() {
  const [urlServicio, setUrlServicio] = useState('http://localhost:3000');
  const [texto, setTexto] = useState('Hola mundo seguro CIB-204');
  const [cifrado, setCifrado] = useState('');
  const [descifrado, setDescifrado] = useState('');
  const [estado, setEstado] = useState('Listo');
  const [token, setToken] = useState('');

  const cabeceras = () => {
    const h = { 'Content-Type': 'application/json' };
    if (token) h['Authorization'] = 'Bearer ' + token;
    return h;
  };

  async function cifrarTexto() {
    setEstado('Cifrando...');
    try {
      const r = await fetch(urlServicio.replace(/\/$/, '') + '/cifrar', {
        method: 'POST',
        headers: cabeceras(),
        body: JSON.stringify({ texto }),
      });
      if (r.status === 401) { setEstado('Error 401: se requiere token'); return; }
      const data = await r.json();
      setCifrado(data.cifrado || '');
      setEstado('Cifrado OK');
    } catch (e) {
      setEstado('Error de red: ' + e.message);
    }
  }

  async function descifrarTexto() {
    setEstado('Descifrando...');
    try {
      const r = await fetch(urlServicio.replace(/\/$/, '') + '/descifrar', {
        method: 'POST',
        headers: cabeceras(),
        body: JSON.stringify({ cifrado }),
      });
      if (r.status === 401) { setEstado('Error 401: se requiere token'); return; }
      const data = await r.json();
      setDescifrado(data.descifrado || '');
      setEstado('Descifrado OK');
    } catch (e) {
      setEstado('Error de red: ' + e.message);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.cont}>
        <Text style={styles.titulo}>Cliente movil - Cifrado CIB-204</Text>

        <Text style={styles.label}>URL del servicio</Text>
        <TextInput style={styles.input} value={urlServicio}
          onChangeText={setUrlServicio} autoCapitalize="none" />

        <Text style={styles.label}>Token (opcional, si el IAM esta activo)</Text>
        <TextInput style={styles.input} value={token}
          onChangeText={setToken} autoCapitalize="none" placeholder="Bearer..." />

        <Text style={styles.label}>Texto a cifrar</Text>
        <TextInput style={styles.input} value={texto} onChangeText={setTexto} />

        <TouchableOpacity style={styles.boton} onPress={cifrarTexto}>
          <Text style={styles.botonTxt}>Cifrar</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Cifrado (resultado)</Text>
        <TextInput style={[styles.input, styles.multi]} value={cifrado}
          multiline editable={false} />

        <TouchableOpacity style={styles.boton} onPress={descifrarTexto}>
          <Text style={styles.botonTxt}>Descifrar</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Descifrado (resultado)</Text>
        <TextInput style={[styles.input, styles.multi]} value={descifrado}
          multiline editable={false} />

        <Text style={styles.estado}>Estado: {estado}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f5f5' },
  cont: { padding: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', color: '#1F4E79', marginBottom: 16 },
  label: { fontWeight: 'bold', marginTop: 10, color: '#202020' },
  input: {
    borderWidth: 1, borderColor: '#bbb', borderRadius: 6,
    padding: 10, backgroundColor: '#fff', marginTop: 4,
  },
  multi: { minHeight: 70 },
  boton: {
    backgroundColor: '#2E75B6', padding: 12, borderRadius: 6,
    marginTop: 12, alignItems: 'center',
  },
  botonTxt: { color: '#fff', fontWeight: 'bold' },
  estado: { marginTop: 16, fontStyle: 'italic', color: '#595959' },
});
