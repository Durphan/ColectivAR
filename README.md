# ColectivAR

API proxy para consultar en tiempo real la ubicación de colectivos en Buenos Aires, Argentina. Consume la API del Gobierno de la Ciudad de Buenos Aires y expone endpoints HTTP + WebSocket.

## Stack

- **Runtime**: Node.js 22
- **Package manager**: pnpm
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **WebSocket**: ws
- **Tests**: Vitest
- **Cache**: node-cache
- **Logging**: Winston + Morgan
- **Documentación**: Swagger (OpenAPI)
- **Linting**: ESLint

## Requisitos

- Node.js >= 18 (recomendado 22)
- pnpm >= 8
- CLIENT_ID y CLIENT_SECRET de la [API de Transporte de BA](https://api-transporte.buenosaires.gob.ar/)

## Inicialización

```bash
# 1. Clonar
git clone https://github.com/Durphan/ColectivAR
cd ColectivAR/server

# 2. Instalar dependencias
pnpm install

# 3. Variables de entorno (crear server/.env)
CLIENT_ID=tu_client_id
CLIENT_SECRET=tu_client_secret

# 4. Iniciar en desarrollo
pnpm dev
```

Servidor HTTP en `http://localhost:8080`. WebSocket en `ws://localhost:8081`. Documentación Swagger en `http://localhost:8080/api-docs`.

## Docker

```bash
docker compose build
docker compose up
```

## Comandos

| Comando | Descripción |
|---|---|
| `pnpm dev` | Desarrollo con hot-reload (tsx watch) |
| `pnpm start` | Producción (Node compilado) |
| `pnpm build` | Compilar TypeScript |
| `pnpm test` | Ejecutar tests |
| `pnpm test:watch` | Tests en modo watch |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/colectivos` | Todos los colectivos |
| GET | `/colectivos/numeros` | Todos los números de línea |
| GET | `/colectivos/rutas` | Todos los destinos |
| GET | `/colectivos/rutas/:numero` | Destinos filtrados por línea |
| POST | `/colectivos-seleccionados` | Body: `{agencia, ruta}` |

## WebSocket

Conectar a `ws://localhost:8081` y enviar:

```json
{ "agencia": "15", "ruta": "A" }
```

El servidor responde cada 30s con los colectivos filtrados.

## Arquitectura

```
Routes → Controller → Service → Repository → BA API
                          ↓
                      WebSocket (mismo service)
```

Cada capa tiene una responsabilidad única y se comunican mediante interfaces (inyección de dependencias).

## Tests

Tests unitarios sobre la capa de Service. El Repository se mockea con `vi.fn()`.

```bash
pnpm test
```

## Licencia

ISC. Ver [LICENSE](LICENSE).
