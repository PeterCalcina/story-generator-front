# Image Story - Frontend

Aplicación web para crear y visualizar historias generadas a partir de imágenes, desarrollada con **React**, **TypeScript** y **Vite**. Permite a los usuarios subir imágenes, describirlas, generar historias y consultar un historial de creaciones, todo con autenticación y una experiencia moderna.

---

## Características principales

- **Autenticación de usuarios** (registro e inicio de sesión)
- **Subida de imágenes** y generación de historias a partir de ellas
- **Visualización de historias** con opción de ver la imagen original y la generada
- **Descarga de historias en PDF**
- **Gestión de historial**: consulta y exploración de historias previas
- **Interfaz moderna y responsiva** con componentes reutilizables

---

## Estructura del proyecto

```
src/
  api/                # Lógica de conexión a servicios y endpoints
    client/           # Configuración de fetcher y queryClient
    hooks/            # Custom hooks para historias
    services/         # Servicios para historias
    endpoints.ts      # Definición de endpoints
  pages/
    auth/             # Páginas de Login y Registro
    history/          # Página principal de historias y componentes de dialogs
  shared/
    components/       # Componentes UI reutilizables (Button, Dialog, Card, etc.)
    lib/              # Utilidades, router y supabase
    schemas/          # Esquemas de validación (zod)
    types/            # Tipos TypeScript para las entidades
  stores/             # Zustand stores para auth y toasts
  layouts/            # Layouts de la app
  App.tsx             # Componente raíz
  main.tsx            # Entry point
```

---

## Principales paquetes y tecnologías utilizadas

- **React**: Librería principal para la UI.
- **TypeScript**: Tipado estático.
- **Vite**: Bundler ultrarrápido para desarrollo y build.
- **React Router DOM**: Navegación y rutas protegidas/públicas.
- **@tanstack/react-query**: Manejo de datos asíncronos y cache.
- **Zustand**: Manejo de estado global simple y eficiente.
- **@supabase/supabase-js**: Conexión con backend y autenticación.
- **Zod**: Validación de formularios y esquemas.
- **React Hook Form**: Manejo de formularios.
- **TailwindCSS**: Utilidades CSS para estilos rápidos y responsivos.
- **Radix UI**: Componentes accesibles y sin estilos para construir la UI (Dialog, Checkbox, Select, etc.).
- **Lucide React**: Iconos SVG modernos.
- **ESLint**: Linter para mantener la calidad del código.
- **class-variance-authority, clsx, tailwind-merge**: Utilidades para manejo de clases CSS dinámicas.

---

## Scripts

- `npm run dev` — Inicia el servidor de desarrollo con HMR.
- `npm run build` — Compila la aplicación para producción.
- `npm run preview` — Previsualiza la build de producción.
- `npm run lint` — Ejecuta ESLint sobre el código fuente.

---

## Flujo de la aplicación

1. **Autenticación**:  
   El usuario debe registrarse o iniciar sesión para acceder a la app.
2. **Página principal (Historias)**:  
   - Ver historial de historias generadas.
   - Crear una nueva historia subiendo una imagen y agregando una descripción.
   - Visualizar detalles de cada historia, alternar entre imagen original y generada, y descargar el PDF.
3. **Componentes reutilizables**:  
   La UI está construida con componentes desacoplados y reutilizables para formularios, diálogos, botones, tablas, etc.

---

## Cómo iniciar el proyecto

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Accede a la app en `http://localhost:5173` (o el puerto que indique Vite).

---

## Personalización y configuración

- **Variables de entorno**:  
  Configura tu archivo `.env` para las claves de Supabase y otros servicios.
- **Estilos**:  
  Personaliza Tailwind en `tailwind.config.js` si lo necesitas.
- **Validaciones**:  
  Los esquemas de Zod están en `src/shared/schemas/`.

---

¿Dudas o sugerencias? ¡No dudes en abrir un issue o contactarnos!