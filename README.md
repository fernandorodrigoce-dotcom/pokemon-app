# Pokémon App 🎮

Aplicación web construida con React que consume la PokeAPI y JSONPlaceholder.

## Tecnologías
- React + Vite
- React Router DOM
- React Query / TanStack Query
- React Hook Form + Zod
- Tailwind CSS v3
- Axios

## Instalación

git clone https://github.com/fernandorodrigoce-dotcom/pokemon-app.git
cd pokemon-app
npm install
npm run dev

## Páginas
- `/` → Pokédex con lista de pokémons, buscador y paginación
- `/pokemon/:id` → Detalle del pokémon con stats, habilidades y formulario de reseña
- `/posts` → CRUD completo de posts
- `/battle` → Modo batalla (próximamente)

## Funcionalidades
- Lista de pokémons con React Query y paginación
- Skeletons de carga con delay de 2 segundos
- Buscador en tiempo real
- Vista de detalle por pokémon
- Formulario validado con Zod y React Hook Form
- CRUD completo con Axios y JSONPlaceholder
- Notificaciones de éxito y error
- Navbar de navegación

## APIs
- PokeAPI: https://pokeapi.co/api/v2/
- JSONPlaceholder: https://jsonplaceholder.typicode.com/