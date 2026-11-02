# ============================================================================
#  Dockerfile  -  Servicio de cifrado
#  >>> VERSION INSEGURA (rama inseguro) <<<
#  Contiene malas practicas INTENCIONADAS que Trivy debe reportar.
# ============================================================================

# [VULN-11] Imagen base "latest" (no reproducible) y pesada, con muchos
#   paquetes de sistema vulnerables. La solucion es una etiqueta fija y una
#   imagen slim (p.ej. node:20-slim).  CWE-1104 / mala practica de imagen.
FROM node:latest

WORKDIR /app

# [VULN-12] Se copia TODO el contexto (incluye .env, llaves y node_modules).
#   Puede filtrar secretos dentro de la imagen.  CWE-538
COPY . .

# Instala dependencias en la imagen (sin fijar el lockfile con npm ci).
RUN npm install

EXPOSE 3000

# [VULN-13] El contenedor corre como ROOT (no hay instruccion USER).
#   Viola el principio de minimo privilegio (NIST SP 800-190). Trivy lo marca.
#   CWE-250 (Execution with Unnecessary Privileges)
CMD ["node", "servidor.js"]
