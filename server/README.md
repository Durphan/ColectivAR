# ColectivAR Backend

API proxy para consultar transporte público de Buenos Aires. Consume la API del Gobierno de la Ciudad y expone endpoints HTTP + WebSocket.

## Arquitectura

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│    Routes    │────▶│  Controller   │────▶│   Service     │────▶│   Repository     │────▶ BA API
│  (URL →      │     │  (handlers)   │     │ (biz logic)   │     │   (data I/O)     │
│   handler)   │     │               │     │               │     │                  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────────┘
        │
        ▼  WebSocket
┌──────────────┐
│     WS       │────▶    Service (misma instancia)
│  (polling)   │
└──────────────┘
```

### Capas

| Capa           | Responsabilidad                                                                         | Archivo                                                  |
| -------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Routes**     | Mapea URLs a handlers del controller. Middleware de validación.                         | `src/routes/bus-positions.routes.js`                     |
| **Controller** | Recibe datos del request, delega al service, retorna respuesta. Sin imports de Express. | `src/features/bus-positions/bus-positions.controller.js` |
| **Service**    | Lógica de negocio: filtros, transformaciones. Sin `req`/`res`/`process.env`.            | `src/features/bus-positions/bus-positions.service.js`    |
| **Repository** | I/O con API externa via axios. Sin filtros de negocio.                                  | `src/features/bus-positions/bus-positions.repository.js` |
| **WebSocket**  | Polling cada 30s. Consume el mismo service que HTTP.                                    | `src/websocket/bus-positions.ws.js`                      |

### Inyección de Dependencias

Todas las dependencias se wirean en `src/injection.js`:

```
ColectivoRepository(config)
  → BusPositionsService(repository)
    → BusPositionsController(service)
    → createBusPositionsRouter(controller) → router
    → setupWebSocket(wss, service)
```

## Stack

- **Runtime**: Node.js
- **Package manager**: pnpm
- **Framework**: Express.js
- **WebSocket**: ws
- **Tests**: Vitest

## Requisitos

- Node.js >= 18 (recomendado 22)
- pnpm >= 8
- CLIENT_ID y CLIENT_SECRET de la API de Transporte de BA

## Inicialización

```bash
# 1. Clonar
git clone <repo-url>
cd ColectivAR-2

# 2. Instalar dependencias
cd server
pnpm install

# 3. Variables de entorno (crear server/.env)
CLIENT_ID=tu_client_id
CLIENT_SECRET=tu_client_secret

# 4. Iniciar
pnpm dev        # desarrollo con hot-reload
pnpm start      # producción
```

Servidor HTTP en `http://localhost:8080`. WebSocket en `ws://localhost:8081`.

## Endpoints

| Método | Ruta                        | Descripción                              |
| ------ | --------------------------- | ---------------------------------------- |
| GET    | `/health`                   | Health check del servicio                |
| GET    | `/colectivos`               | Todos los colectivos                     |
| GET    | `/colectivos/numeros`       | Todos los números de línea               |
| GET    | `/colectivos/rutas`         | Todos los destinos                       |
| GET    | `/colectivos/rutas/:numero` | Destinos filtrados por línea             |
| GET    | `/colectivos/:numero/:ruta` | Colectivos filtrados por línea y destino |
| POST   | `/colectivos-seleccionados` | Body: `{agencia, ruta}`                  |

## Tests

```bash
cd server
pnpm test        # una vez
pnpm test:watch  # modo watch
```

Tests unitarios exclusivamente sobre la capa de **Service**. El Repository se mockea con `vi.fn()`.

## WebSocket

Conectar a `ws://localhost:8081` y enviar:

```json
{ "agencia": "15", "ruta": "A" }
```

El servidor responde cada 30s con los colectivos filtrados.

## Cómo contribuir

1. `git checkout -b feat/nombre-cambio`
2. Seguir la arquitectura de capas (Routes → Controller → Service → Repository)
3. El Service es la única capa con tests unitarios
4. `pnpm test` antes de commitear
5. Crear PR describiendo el cambio, capas afectadas y tests
