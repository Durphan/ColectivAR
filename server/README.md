# ColectivAR Backend

API proxy para consultar transporte público de Buenos Aires. Consume la API del Gobierno de la Ciudad y expone endpoints HTTP + WebSocket.

## Stack

- **Runtime**: Node.js 22
- **Package manager**: pnpm
- **Lenguaje**: TypeScript (strict mode, ESNext modules)
- **Framework**: Express.js
- **WebSocket**: ws
- **Tests**: Vitest (con vi.fn() para mocks)
- **Cache**: `@cacheable/node-cache` (TTL 30s)
- **Logging**: Winston + Morgan (HTTP request logging)
- **Validación**: Validación manual de parámetros
- **Documentación**: Swagger (OpenAPI 3.0 via swagger-jsdoc)
- **Linting**: ESLint + globals
- **Build**: TypeScript compiler (tsc)

## Requisitos

- Node.js >= 18 (recomendado 22)
- pnpm >= 8
- CLIENT_ID y CLIENT_SECRET de la [API de Transporte de BA](https://api-transporte.buenosaires.gob.ar/)

## Inicialización

```bash
cd server
pnpm install

# Crear .env en server/
CLIENT_ID=tu_client_id
CLIENT_SECRET=tu_client_secret

pnpm dev      # desarrollo con hot-reload (tsx watch)
pnpm start    # producción (node dist/src/index.js)
```

Servidor HTTP en `http://localhost:8080`. WebSocket en `ws://localhost:8081`. Swagger en `http://localhost:8080/api-docs`.

## Estructura del proyecto

```
server/
├── app.ts                          # Configuración de Express (cors, compression, morgan, json)
├── src/
│   ├── index.ts                    # Entry point: arranca HTTP (8080) + WS (8081)
│   ├── injection.ts                # Wireado de dependencias (DI manual)
│   ├── common/
│   │   ├── config/
│   │   │   ├── cache.ts            # Cache genérico con TTL configurable
│   │   │   ├── env.ts              # Variables de entorno tipadas
│   │   │   ├── logger.ts           # Winston logger (console + file)
│   │   │   ├── swagger.ts          # Configuración OpenAPI
│   │   │   ├── interfaces/
│   │   │   │   └── ICache.ts       # Interfaz del cache
│   │   │   └── types/              # Tipos internos de configuración
│   │   └── middleware/
│   │       ├── error-handler.ts    # Manejador global de errores
│   │       └── zod-validate.ts     # Validación de parámetros con Zod
│   ├── features/
│   │   └── bus-positions/
│   │       ├── bus-positions.controller.ts
│   │       ├── bus-positions.service.ts
│   │       ├── bus-positions.repository.ts
│   │       └── interfaces/
│   │           ├── bus-positions-controller.ts
│   │           ├── bus-positions-service.ts
│   │           ├── colectivo-polling-service.ts
│   │           └── colectivo-repository.ts
│   ├── routes/
│   │   └── bus-positions.routes.ts # Definición de rutas Express
│   ├── schemas/                    # (reservado para schemas de validación)
│   ├── types/
│   │   ├── api-response.ts         # Tipos de respuesta unificada
│   │   ├── express-helpers.ts      # Helpers tipados para Express
│   │   └── vehicle-position.ts     # Tipo VehiclePosition
│   └── websocket/
│       ├── bus-positions.ws.ts     # Lógica de WebSocket (polling cada 30s)
│       └── ws-message.ts           # Tipos de mensajes WS
├── tests/
│   └── services/
│       └── bus-positions.service.test.ts
├── dist/                           # Compilado TypeScript
├── Dockerfile                      # Multi-stage build (node:22-alpine)
├── eslint.config.js
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```

## Arquitectura

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│    Routes    │────▶│  Controller   │────▶│   Service     │────▶│  Repository   │────▶│   BA API         │
│  (URL →      │     │  (handlers)   │     │ (biz logic)   │     │  (data I/O)   │     │  (transporte)    │
│   handler)   │     │               │     │               │     │               │     │                  │
└──────────────┘     └──────────────┘     └──────────────┘     └───────┬───────┘     └──────────────────┘
                                                                       │
                                                                       ▼ Cache
                                                              ┌─────────────────┐
                                                              │  node-cache     │
                                                              │  (TTL: 30s)     │
                                                              └─────────────────┘
                          ┌──────────────┐
                          │  WebSocket   │────▶ Service (misma instancia)
                          │  (polling)   │
                          └──────────────┘
```

### Capas

| Capa | Responsabilidad | Archivo |
|---|---|---|
| **Routes** | Mapea URLs a handlers del controller. Middleware de validación. | `src/routes/bus-positions.routes.ts` |
| **Controller** | Recibe datos del request, delega al service, retorna respuesta. Sin imports de Express. | `src/features/bus-positions/bus-positions.controller.ts` |
| **Service** | Lógica de negocio: filtros, transformaciones. Sin `req`/`res`/`process.env`. | `src/features/bus-positions/bus-positions.service.ts` |
| **Repository** | I/O con API externa via axios, cachea respuestas. Sin filtros de negocio. | `src/features/bus-positions/bus-positions.repository.ts` |
| **WebSocket** | Polling cada 30s. Consume el mismo service que HTTP. | `src/websocket/bus-positions.ws.ts` |

### Inyección de Dependencias

Todas las dependencias se wirean en `src/injection.ts`:

```
Cache<VehiclePosition>(30)
  → ColectivoRepository(config, cache)
    → BusPositionsService(repository)
      → BusPositionsController(service)
      → createBusPositionsRouter(controller) → router
      → setupWebSocket(wss, service)
```

Cada capa depende de una interfaz, no de una implementación concreta. Las interfaces están en `src/features/bus-positions/interfaces/`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Health check del servicio |
| GET | `/colectivos` | Todos los colectivos |
| GET | `/colectivos/numeros` | Todos los números de línea |
| GET | `/colectivos/rutas` | Todos los destinos |
| GET | `/colectivos/rutas/:numero` | Destinos filtrados por línea |
| POST | `/colectivos-seleccionados` | Body: `{agencia, ruta}` |

La documentación interactiva (OpenAPI) está disponible en `/api-docs`.

## WebSocket

Conectar a `ws://localhost:8081` y enviar un mensaje JSON:

```json
{ "agencia": "15", "ruta": "A" }
```

**Formato de mensaje:** `{ agencia: string; ruta: string }` (ver `src/websocket/ws-message.ts`)

El servidor responde cada 30s con los colectivos filtrados según la línea y destino solicitados. Usa el mismo `BusPositionsService` que la API HTTP.

## Cache

El `ColectivoRepository` cachea las respuestas de la API de BA usando `node-cache` con un TTL de 30 segundos. El cache es genérico (`Cache<T>`) y trabaja sobre la interfaz `ICache<T>`.

## Logging

- **Winston**: Logging estructurado a consola y archivo (`src/common/config/logger.ts`)
- **Morgan**: HTTP request logging en formato `combined`, redirigido a Winston

## Manejo de errores

Error handler global en `src/common/middleware/error-handler.ts`. Captura errores no manejados y retorna respuestas JSON consistentes con el código de estado apropiado.

## Validación

Middleware de validación en `src/common/middleware/zod-validate.ts`. Valida parámetros con Zod schemas antes de que lleguen al controller.

## Tests

```bash
pnpm test        # una vez
pnpm test:watch  # modo watch
```

Tests unitarios exclusivamente sobre la capa de **Service**. El Repository se mockea con `vi.fn()`.

Archivo de tests: `tests/services/bus-positions.service.test.ts`

## ESLint

```bash
pnpm lint         # revisar
pnpm lint:fix     # auto-fix
```

Configuración en `eslint.config.js` (formato flat config).

## Docker

```bash
# Build
pnpm build

# O directamente con compose desde la raíz del proyecto:
docker compose build server
```

Multi-stage build:
1. **Stage 1 (build)**: `node:22-alpine`, instala dependencias con pnpm, compila TypeScript
2. **Stage 2 (runtime)**: `node:22-alpine`, solo copia `dist/` y `package.json`, ejecuta como `node` no-root

Puertos: `8080` (HTTP) y `8081` (WebSocket).

## Variables de entorno

| Variable | Descripción |
|---|---|
| `CLIENT_ID` | Client ID de la API de Transporte de BA |
| `CLIENT_SECRET` | Client Secret de la API de Transporte de BA |

Tipadas en `src/common/config/env.ts`.

## Cómo contribuir

1. `git checkout -b feat/nombre-cambio`
2. Seguir la arquitectura de capas (Routes → Controller → Service → Repository)
3. El Service es la única capa con tests unitarios
4. Mantener las interfaces actualizadas
5. `pnpm test` y `pnpm lint` antes de commitear
6. Crear PR describiendo el cambio, capas afectadas y tests
