# Jerarquía de diseño del sistema

```
Sistema de cifrado seguro
|
|- 1. Aplicacion movil (cliente)            [app-movil/]
|     |- App.js .............. interfaz: cifrar / descifrar; maneja el token
|     |- package.json / app.json ... configuracion de Expo
|
|- 2. Servicio de cifrado (backend)         [servidor/]
|     |- servidor.js ......... API REST (/salud, /cifrar, /descifrar, ...)
|     |- cifrado.js .......... modulo RSA (cifrar, descifrar, generar llaves)
|     |- auth.js ............. verificacion de identidad (IAM / JWT)
|     |- db.js ............... acceso a la bitacora (consulta SQL)
|     |- config.js .......... parametros y secretos del servicio
|     |- Dockerfile ......... imagen del contenedor
|
|- 3. Gestion de identidad (IAM)            [docker-compose.yml]
|     |- keycloak ........... emite y valida tokens (OIDC / JWT)
|
|- 4. Proceso de seguridad (DevSecOps)      [.github/workflows/]
      |- devsecops.yml ...... SAST, secretos, SCA, imagen y DAST
```

## Relación entre componentes

1. La **app móvil** envía el texto al **servicio de cifrado** por HTTP(S).
2. Si el IAM está activo, la app primero pide un **token** a **Keycloak** y lo
   adjunta en cada petición.
3. El **servicio** valida el token (auth.js), cifra/descifra con **RSA**
   (cifrado.js) y registra la operación (db.js).
4. El **pipeline** revisa todo el conjunto en cada cambio: código (SAST),
   secretos, dependencias (SCA), imagen del contenedor y la app en ejecución
   (DAST).

## Subsistemas (para el análisis de riesgo)

| Subsistema | Componentes | Datos sensibles |
|------------|-------------|-----------------|
| Interfaz | app-movil/App.js | texto del usuario |
| Comunicación | fetch/HTTP, CORS | texto en tránsito |
| Cifrado | servidor/cifrado.js | llave privada |
| Gestión de llaves | generación/almacenamiento | llave privada |
| IAM | auth.js + Keycloak | tokens, credenciales |
| Persistencia | db.js | bitácora |
| Contenedor | Dockerfile | imagen, secretos |
| Pipeline | devsecops.yml | reportes |
