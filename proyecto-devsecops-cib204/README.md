# Proyecto DevSecOps - CIB-204 Seguridad del Software

**Universidad Cenfotec · Maestría en Ciberseguridad · Prof. Carlos Cantero Granados**

Laboratorio 100 % en la nube (GitHub Codespaces + GitHub Actions). Construyes y
aseguras una **aplicación móvil (cliente)** que consume un **servicio de cifrado
RSA (Node.js)** protegido con **Keycloak (IAM)** y empaquetado en un contenedor.
Un **pipeline DevSecOps** analiza el código y la aplicación en cada cambio.

> ⚠️ **Este repositorio arranca INSEGURO a propósito.** La rama `inseguro`/`main`
> contiene vulnerabilidades intencionadas. Tu trabajo (Fase 2) es corregirlas
> hasta que el pipeline quede **en verde**. La guía paso a paso te lleva de la
> mano por cada corrección.

## Arquitectura

```
App móvil (Expo/React Native)  ->  API de cifrado (Node.js/RSA)  ->  Keycloak (IAM)
        app-movil/                        servidor/               docker-compose.yml
                          Pipeline: .github/workflows/devsecops.yml
```

## Pruebas de seguridad del pipeline

| Capa | Herramienta | Qué revisa |
|------|-------------|------------|
| SAST | Semgrep + CodeQL | eval(), inyección SQL/comandos, JWT inseguro, CORS |
| Secretos | Gitleaks | claves quemadas, `.env` y llaves privadas versionadas |
| SCA | npm audit + Trivy (fs) | dependencias vulnerables |
| Imagen | Trivy (image) + Syft (SBOM) | base insegura, root, CVEs del contenedor |
| DAST | OWASP ZAP | cabeceras de seguridad ausentes, CORS abierto |

## Cómo empezar

1. Crea un **Codespace** desde el botón verde *Code* → *Codespaces*.
2. Verifica el entorno: `node --version`, `docker --version`.
3. Levanta el stack: `docker compose up -d --build`.
4. Ejecuta la app: `cd app-movil && npm install && npx expo start --web`.
5. Sube un cambio (*commit* + *push*) y observa el pipeline en la pestaña
   **Actions**.

La guía completa (`Guia_CIB204_DevSecOps.docx`) explica cada paso en detalle,
incluyendo cómo interpretar cada hallazgo y cómo corregirlo.

## Fases del laboratorio

- **Fase 1 — Diagnóstico:** sube el proyecto, corre el pipeline y observa cómo
  cada herramienta reporta en rojo las vulnerabilidades.
- **Fase 2 — Remediación:** corrige el código, las dependencias, el Dockerfile
  y la configuración hasta dejar todos los *checks* en verde.

> Docentes: la carpeta `solucion-docente/` contiene la versión endurecida de
> referencia y el mapa de cada vulnerabilidad a su corrección, CWE y herramienta.
