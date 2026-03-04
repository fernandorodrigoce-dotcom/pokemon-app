# Pokemon App — Prueba Tecnica Frontend Developer

Aplicacion web interactiva estilo Pokedex retro construida con React + Vite, consumiendo PokeAPI, JSONPlaceholder y Firebase. Incluye sistema de autenticacion con Google, coleccion personal de pokemons persistida en la nube, batalla contra IA y modo PvP en tiempo real.

Demo en vivo: https://pokemon-c9800.web.app
Repositorio: https://github.com/fernandorodrigoce-dotcom/pokemon-app

---

## Tabla de Contenidos

- [Tecnologias Obligatorias](#tecnologias-obligatorias)
- [APIs y Servicios Utilizados](#apis-y-servicios-utilizados)
- [Niveles Completados](#niveles-completados)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalacion](#instalacion)
- [Variables de Entorno](#variables-de-entorno)
- [Decisiones Tecnicas](#decisiones-tecnicas)

---

## Tecnologias Obligatorias

| Tecnologia | Version | Uso en el proyecto |
|---|---|---|
| React | 19.2.0 | UI principal y componentes |
| React Router DOM | 7.13.0 | Navegacion entre paginas y rutas dinamicas |
| TanStack React Query | 5.90.21 | Consumo de API, cache y estado del servidor |
| React Hook Form | 7.71.2 | Manejo de formularios |
| Axios | 1.13.5 | Operaciones CRUD con JSONPlaceholder |
| Tailwind CSS | 3.4.19 | Estilos utilitarios y diseno responsivo |
| Zod | 4.3.6 | Validacion de esquemas y formularios |

### Tecnologias adicionales

| Tecnologia | Version | Uso |
|---|---|---|
| Vite | 7.3.1 | Bundler y servidor de desarrollo |
| Firebase Auth | 12.9.0 | Autenticacion con Google |
| Firebase Firestore | 12.9.0 | Persistencia de coleccion de pokemons por usuario |
| Firebase Realtime Database | 12.9.0 | Sincronizacion en tiempo real para PvP |
| Firebase Hosting | — | Deploy de la aplicacion |

---

## APIs y Servicios Utilizados

| Servicio | URL | Uso |
|---|---|---|
| PokeAPI | `https://pokeapi.co/api/v2/` | Pokemons, movimientos, evoluciones, sprites |
| JSONPlaceholder | `https://jsonplaceholder.typicode.com/` | CRUD completo de posts |
| Firebase | `https://firebase.google.com/` | Autenticacion, base de datos de usuarios y colecciones, salas PvP en tiempo real |

### Integracion entre servicios

Los tres servicios estan relacionados entre si dentro de la aplicacion:

- El usuario inicia sesion con Firebase Auth (Google)
- Al desbloquear un pokemon de la PokeAPI resolviendo un puzzle, ese pokemon se guarda en su perfil de Firebase Firestore vinculado a su cuenta
- Al entrar al modo batalla, se carga su coleccion personal desde Firestore para usarla en combate
- Las salas de batalla PvP se sincronizan en tiempo real con Firebase Realtime Database
- El modulo de posts consume JSONPlaceholder como segunda API independiente con CRUD completo via Axios

---

## Niveles Completados

### Nivel 1 — Basico

Objetivo: Mostrar una lista de elementos desde una API con informacion basica.

**Requerimientos completados:**

- Lista de los 151 pokemons originales consumida con React Query desde PokeAPI
- Interfaz disenada con Tailwind CSS, responsiva en todos los tamanos de pantalla
- Skeletons animados durante la carga de cada pagina de pokemons
- Campo de busqueda que filtra por nombre de pokemon
- Repositorio en GitHub con ramas por nivel

**Adicionales:**

- Estetica pixel art retro con fuente Press Start 2P y paleta de colores de la Pokedex oficial
- Animacion de encendido de Pokedex con sonido generado por Web Audio API al ingresar a la pagina
- El buscador consulta los 151 pokemons en tiempo real, no solo los 20 de la pagina activa
- Persistencia de pagina actual y estado de encendido en `sessionStorage` para mantener la posicion al navegar
- Pokemons bloqueados muestran silueta negra con signo de interrogacion
- Pokemons desbloqueados muestran sprite completo, nombre y tipo con color segun elemento

---

### Nivel 2 — Intermedio

Objetivo: Crear una interfaz mas interactiva con navegacion, validaciones y detalle de elementos.

**Requerimientos completados:**

- Vista de detalle al hacer clic en un pokemon en la ruta `/pokemon/:id`
- Navegacion entre paginas con React Router y rutas dinamicas
- Paginacion del listado de pokemons
- Formulario de resena por pokemon validado con Zod y React Hook Form

**Adicionales:**

- Carta de detalle estilo TCG con fondo dorado, borde del color del tipo principal y barras de estadisticas animadas
- Cadena de evoluciones completa con navegacion directa a cada evolucion desde la carta
- Sistema de desbloqueo de pokemons mediante puzzle deslizante 3x3 con la imagen oficial del pokemon dividida en piezas. Soporta movimiento de multiples piezas en la misma fila o columna con un solo clic
- Autenticacion con Google via Firebase Auth para persistir la coleccion personal
- Pokemons desbloqueados se guardan en Firebase Firestore vinculados al usuario autenticado
- Sin cuenta el desbloqueo funciona igual pero se advierte al usuario que su progreso no se guardara

---

### Nivel 3 — Avanzado

Objetivo: Implementar una SPA completa con arquitectura escalable y logica avanzada.

**Requerimientos completados:**

- CRUD completo de posts con JSONPlaceholder
  - Listar, crear, editar y eliminar posts
  - Axios para todas las operaciones de mutacion (POST, PUT, DELETE)
  - Formularios de creacion y edicion validados con Zod y React Hook Form
- Manejo de errores con notificaciones Toast personalizadas en todas las acciones del CRUD
- Integracion de multiples APIs y servicios: PokeAPI, JSONPlaceholder y Firebase
- Modularizacion avanzada con hooks personalizados y arquitectura por features
- Componentes reutilizables: Toast, SkeletonCard, Pagination, PokemonCard, MoveSelector
- Animaciones en toda la aplicacion: encendido de Pokedex, transiciones pixel art, barras de stats, efectos de batalla
- Deploy en Firebase Hosting
- Documentacion en README

**Adicionales:**

- Modo Arcade: batalla por turnos contra rival aleatorio de los primeros 151 pokemons controlado por la IA. Implementa la formula de dano oficial de Pokemon Generacion 3 con STAB, ventajas de tipo, criticos y factor aleatorio. Flujo independiente en la ruta `/arcade` con seleccion de movimientos y shell de consola consistente con el resto de la aplicacion
- Modo PvP Online: batalla en tiempo real entre dos jugadores usando Firebase Realtime Database. Flujo completo de sala con codigo de 6 caracteres, seleccion de equipo de 3 pokemons de la coleccion personal, eleccion de 4 movimientos por pokemon, turnos sincronizados y manejo de desconexiones
- Chat en tiempo real durante la batalla PvP sincronizado con Firebase Realtime Database
- Sistema de revancha al terminar la batalla con confirmacion de ambos jugadores en 60 segundos
- Panel de administracion protegido por UID para buscar usuarios por correo y asignar pokemons desde la PokeAPI directamente a sus colecciones
- Cloud Functions para limpieza automatica de salas expiradas o abandonadas cada 30 minutos

---

## Estructura del Proyecto

```
src/
├── components/
│   ├── battle/
│   │   ├── arcade/              # ArcadeMode — Componente de batalla Arcade vs IA
│   │   ├── pokemonesdeinicio/   # StarterSelection — Seleccion de pokemon inicial
│   │   ├── pvp/                 # BattleArena, BattleChat, WaitingRoom, PokemonSelector
│   │   └── reutilizablepvp/    # MoveSelector — Compartido entre Arcade y PvP
│   ├── funcionespagina/         # Navbar, Pagination, SkeletonCard, Toast
│   ├── pokemon/                 # PokemonCard, PokemonForm, PuzzleModal, SlidingPuzzle
│   └── posts/                   # PostCard, PostForm
│
├── hooks/
│   ├── autenticaciongoo/        # useAuth — Autenticacion Firebase
│   ├── batalla/                 # useBattle, usePvP, usePvPBattle
│   └── pokemon/                 # usePokemon, useUnlocked
│
├── pages/
│   ├── Admin.jsx                # Panel de administracion
│   ├── Arcade.jsx               # Flujo completo Arcade: seleccion de movimientos y batalla
│   ├── Battle.jsx               # Menu principal de batalla
│   ├── Home.jsx                 # Pokedex con listado y busqueda
│   ├── PokemonDetail.jsx        # Detalle de pokemon en formato carta
│   ├── Posts.jsx                # CRUD de posts
│   └── PvP.jsx                  # Flujo completo PvP online
│
├── App.jsx                      # Rutas principales
├── firebase.js                  # Configuracion Firebase
├── index.css                    # Estilos globales y animaciones pixel art
└── main.jsx
```

---

## Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/fernandorodrigoce-dotcom/pokemon-app.git
cd pokemon-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para produccion
npm run build
```

---

## Variables de Entorno

Crea un archivo `.env` en la raiz del proyecto con las siguientes variables:

```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_DATABASE_URL=https://tu_proyecto-default-rtdb.firebaseio.com
```

---

## Decisiones Tecnicas

### React Query para fetching
TanStack Query maneja automaticamente el cache, estados de carga y error. Evita refetches innecesarios al navegar entre paginas y simplifica el codigo de consumo de APIs frente a manejar el estado manualmente con useState y useEffect.

### Axios para mutaciones del CRUD
Se uso Axios para las operaciones de mutacion (POST, PUT, DELETE) sobre JSONPlaceholder. Su sintaxis es mas limpia que fetch para enviar datos con Content-Type application/json y maneja automaticamente la serializacion y deserializacion de JSON.

### Zod + React Hook Form
La combinacion del resolver de Zod con React Hook Form permite definir el esquema de validacion una sola vez y reutilizarlo tanto en la validacion del formulario en tiempo real como para tipar los datos antes de enviarlos a la API.

### Firebase Realtime Database para PvP
Se eligio Realtime Database sobre Firestore para la batalla PvP por su sincronizacion instantanea mediante WebSockets, que actualiza el estado del juego en ambos clientes sin necesidad de polling. Firestore se reservo para datos que no requieren sincronizacion en tiempo real como la coleccion de pokemons del usuario.

### useRef para evitar closures en batalla
El sistema de batalla usa useRef para los valores de HP y estado de la partida, evitando el problema clasico de closures desactualizadas dentro de setTimeout. Sin esto, el calculo de dano del rival usaria siempre el valor inicial de HP en lugar del valor actual en cada turno. Este patron se aplica tanto en el modo Arcade (useBattle) como en el modo PvP (usePvPBattle).

### Separacion de hooks de batalla
El modo Arcade usa useBattle, un hook local sin Firebase que gestiona el estado de HP, los turnos y el ataque automatico del rival mediante setTimeout. El modo PvP usa usePvPBattle, un hook sincronizado con Firebase Realtime Database. Ambos comparten la misma formula de dano y tabla de tipos pero operan de forma completamente independiente.

### sessionStorage para experiencia de usuario en Pokedex
Al navegar al detalle de un pokemon y volver, el Home recupera la pagina activa y el estado de encendido desde sessionStorage. Esto evita que el usuario tenga que volver a encender la Pokedex y pierda su posicion en el listado cada vez que navega a otra pantalla.

### Formula de dano oficial Gen 3

```
dano = ((2 x nivel / 5 + 2) x poder x ataque / defensa) / 50 + 2
     x STAB x ventaja_de_tipo x critico x aleatorio
```

- STAB: x1.5 si el tipo del movimiento coincide con el tipo del pokemon atacante
- Criticos: 6% de probabilidad con x2 de dano
- Aleatorio: factor entre 0.85 y 1.00 para variacion natural entre ataques

---

## Autor

Fernando Rodrigo CE
GitHub: https://github.com/fernandorodrigoce-dotcom