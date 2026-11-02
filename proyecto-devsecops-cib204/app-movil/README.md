# App movil (cliente) - CIB-204

Cliente Expo/React Native que consume el servicio de cifrado.

## Ejecutar en modo web (lo mas simple, dentro del Codespace)

```bash
cd app-movil
npm install
npx expo start --web
```

Codespaces reenvia el puerto **8081**. Abre la app desde la pestaña *Ports*.

## Ejecutar en un telefono (opcional)

1. Instala **Expo Go** en tu telefono.
2. `npx expo start --tunnel` y escanea el codigo QR.
3. En la app, en *URL del servicio*, pega la URL publica que Codespaces
   reenvia para el puerto **3000** (no uses `localhost` desde el telefono).

## Importante (en la nube)

La app corre en el navegador de tu equipo, donde `localhost` es TU
computadora, no el Codespace. Copia la URL reenviada del puerto 3000 y
pegala en el campo *URL del servicio* de la app.
