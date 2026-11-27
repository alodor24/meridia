<p align="center">
  <img src="apps/web/src/assets/images/logo_light_meridia.svg" alt="Meridia" width="260" />
</p>

<h1 align="center">Meridia</h1>

<p align="center">
  <strong>Tus finanzas, bajo control.</strong><br />
  Aplicación web de gestión financiera personal para registrar, organizar y analizar tus finanzas.
</p>

<p align="center">
  Versión 1.0.0 · Monorepo TypeScript · Interfaz en español
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/Licencia-MIT-yellow.svg" alt="Licencia: MIT" /></a>
</p>

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
  - [Objetivo principal](#objetivo-principal)
  - [Problema que resuelve](#problema-que-resuelve)
  - [Público objetivo](#público-objetivo)
  - [Beneficios](#beneficios)
- [Características principales](#características-principales)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Arquitectura y estructura del proyecto](#arquitectura-y-estructura-del-proyecto)
  - [Estructura del monorepo](#estructura-del-monorepo)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Paquete compartido](#paquete-compartido)
- [API REST](#api-rest)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Variables de entorno](#variables-de-entorno)
  - [Backend](#backend-1)
  - [Frontend](#frontend-1)
- [Base de datos](#base-de-datos)
- [Scripts disponibles](#scripts-disponibles)
- [Pruebas y calidad](#pruebas-y-calidad)
- [Despliegue](#despliegue)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Autoría y licencia](#autoría-y-licencia)
  - [Licencia](#licencia)
- [Estado del proyecto](#estado-del-proyecto)

---

## Descripción general

**Meridia** es una aplicación web full-stack de gestión financiera personal. Permite a cada usuario administrar sus cuentas, registrar ingresos y gastos, organizarlos por categorías, consultar el estado de sus finanzas y generar reportes.

La aplicación está construida como un monorepo con un frontend en React, un API en Node.js/Express y una base de datos PostgreSQL. La interfaz está completamente en español y está pensada para usarse desde el navegador en escritorio y dispositivos móviles.

| Aspecto               | Detalle                               |
| --------------------- | ------------------------------------- |
| Nombre                | Meridia                               |
| Versión               | 1.0.0                                 |
| Tipo                  | Aplicación web full-stack             |
| Idioma de la interfaz | Español                               |
| Moneda                | Configurable por usuario y por cuenta |
| Autenticación         | JWT con verificación de email         |
| Base de datos         | PostgreSQL                            |

### Objetivo principal

Centralizar la gestión de las finanzas personales en una sola aplicación, ofreciendo una visión clara de los saldos, los movimientos del mes, la evolución anual y las fechas de pago pendientes.

### Problema que resuelve

Meridia busca evitar la dispersión de la información financiera en hojas de cálculo o notas separadas, y facilitar la respuesta a preguntas como:

- ¿Cuánto dinero tengo disponible entre todas mis cuentas?
- ¿Cuánto ingresé y gasté durante el mes?
- ¿En qué categorías se concentran mis gastos?
- ¿Cómo evolucionaron mis finanzas respecto del mes o año anterior?
- ¿Qué pagos o recordatorios tengo próximos?

### Público objetivo

Personas hispanohablantes que quieren llevar un control simple de sus finanzas personales sin depender de herramientas contables complejas. La aplicación permite elegir país y moneda al registrarse, y admite cuentas con distintas monedas.

### Beneficios

- ✅ Registro manual de ingresos y gastos con categorías personalizables.
- ✅ Vista consolidada de cuentas y saldos calculados automáticamente.
- ✅ Dashboard mensual con comparaciones y desglose por categoría.
- ✅ Analítica anual y trimestral con gráficos.
- ✅ Reportes exportables en PDF y CSV.
- ✅ Calendario de recordatorios con recurrencias.
- ✅ Autenticación con verificación de email y recuperación de contraseña.
- ✅ Interfaz responsive con modo claro y oscuro.

> **Alcance actual:** los movimientos se cargan manualmente. No se encontraron integraciones bancarias, importación automática de extractos ni aplicación móvil nativa en el repositorio.

---

## Características principales

Todas las funcionalidades listadas a continuación están implementadas en el código actual.

| Área               | Funcionalidades                                                                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Autenticación      | Registro con nombre, email, contraseña, país y moneda; verificación de email; login; refresh de sesión; logout; recuperación y restablecimiento de contraseña. |
| Perfil             | Edición del nombre y carga de avatar mediante Cloudinary, con recorte, conversión a WebP y validación de tamaño.                                               |
| Cuentas            | Creación, edición, consulta y eliminación de cuentas de tipos efectivo, banco, tarjeta de crédito, ahorro, inversión y billetera virtual.                      |
| Transferencias     | Transferencias de saldo entre cuentas compatibles, con validación de moneda y saldo disponible, e historial de operaciones.                                    |
| Categorías         | Categorías de ingreso y gasto con color e ícono; categorías iniciales creadas automáticamente al verificar el email.                                           |
| Movimientos        | Registro de ingresos y gastos con cuenta, categoría, monto, fecha y nota; filtros por fecha, cuenta, categoría y tipo; paginación.                             |
| Dashboard          | Balance total, ingresos, gastos y balance del mes; comparación con el mes anterior; últimos movimientos; desglose por categoría y resumen diario.              |
| Analítica          | Totales anuales, evolución mensual, resumen trimestral, desglose por categorías y selector de año.                                                             |
| Reportes           | Reportes mensuales, anuales y personalizados; filtros por cuenta, categoría y tipo; salida en PDF con gráficos o CSV.                                          |
| Calendario         | Recordatorios puntuales y recurrentes (día, semana, mes o año), estados pendiente/pagado, vencimientos y vista de agenda.                                      |
| Notificaciones     | Campana interna con recordatorios pendientes de los próximos días y acceso directo al calendario.                                                              |
| Feedback           | Formulario de sugerencias, comentarios y casos de uso; el mensaje se guarda y se notifica por email al desarrollador cuando SMTP está configurado.             |
| Experiencia de uso | Tema claro/oscuro persistente, ocultamiento de importes, formato de importes con moneda configurable, navegación protegida y diseño responsive.                |

### Autenticación y usuarios

- La contraseña debe tener entre 12 y 64 caracteres, con al menos una minúscula, una mayúscula, un número y un símbolo.
- La cuenta debe verificar el email antes de poder iniciar sesión.
- El acceso usa un token JWT de corta duración y un refresh token rotatorio almacenado en una cookie `httpOnly`.
- El restablecimiento de contraseña invalida los refresh tokens activos del usuario.
- Los enlaces de verificación y restablecimiento se generan usando `WEB_APP_URL`.

### Cuentas y transferencias

- El saldo de cada cuenta se calcula a partir de sus ingresos, gastos y transferencias; no se almacena como un campo editable.
- No se puede eliminar una cuenta con movimientos o transferencias asociadas.
- Las transferencias solo se permiten entre cuentas de tipo efectivo, banco, billetera virtual o ahorro.
- Las cuentas de origen y destino deben tener la misma moneda y la cuenta de origen debe tener saldo suficiente.

### Movimientos y categorías

- Cada movimiento pertenece a una cuenta y a una categoría, y debe ser de tipo `income` o `expense`.
- Los filtros disponibles son rango de fechas, cuenta, categoría y tipo, con paginación por `limit` y `offset`.
- Al verificar el email se crean 12 categorías iniciales: 4 de ingresos y 8 de gastos.
- No se puede eliminar una categoría que esté siendo usada por movimientos.

### Dashboard y analítica

- El dashboard permite navegar entre meses y muestra la variación porcentual respecto del mes anterior.
- Incluye balance total, ingresos, gastos, balance del período, últimos movimientos, distribución por categoría y resumen diario.
- La analítica permite seleccionar un año y consultar totales, evolución mensual, trimestres y categorías.
- La opción de ocultar importes se guarda en `localStorage`.

### Reportes

- Períodos disponibles: mensual, anual y personalizado.
- Filtros opcionales: cuenta, categoría y tipo de movimiento.
- El PDF incluye resumen, gráficos y detalle según el período; el CSV incluye el detalle de los movimientos.
- Cuando hay movimientos en varias monedas, el reporte se organiza en secciones por moneda.

### Calendario y recordatorios

- Recurrencias por día, semana, mes o año, con intervalo de 1 a 999 y fecha de fin opcional.
- Cada ocurrencia puede estar pendiente o pagada; el calendario marca visualmente los vencimientos.
- Es posible editar o eliminar una ocurrencia puntual o toda la serie.
- La campana de notificaciones consulta los recordatorios pendientes desde hoy y hasta 3 días después.

---

## Tecnologías utilizadas

### Frontend

| Tecnología                 | Uso                                                    |
| -------------------------- | ------------------------------------------------------ |
| React 19                   | Biblioteca de interfaz de usuario.                     |
| TypeScript                 | Tipado estático en todo el proyecto.                   |
| Vite 8                     | Servidor de desarrollo y build del frontend.           |
| TanStack Router            | Enrutamiento basado en archivos y protección de rutas. |
| TanStack Query             | Obtención, caché e invalidación de datos del API.      |
| MUI 9                      | Componentes de interfaz, tema y estilos.               |
| MUI X Date Pickers         | Selección de fechas.                                   |
| MUI X Scheduler (beta)     | Vista de calendario y agenda de recordatorios.         |
| Chart.js + react-chartjs-2 | Gráficos del dashboard, analítica y reportes.          |
| Axios                      | Cliente HTTP con interceptores y refresh automático.   |
| Formik + Yup               | Formularios y validación en el frontend.               |
| Zustand                    | Estado global de interfaz (tema, drawer, snackbar).    |
| date-fns                   | Manipulación y formato de fechas.                      |
| react-dropzone             | Carga y validación de imágenes de avatar.              |
| react-country-flag         | Banderas de países en formularios.                     |

### Backend

| Tecnología         | Uso                                                       |
| ------------------ | --------------------------------------------------------- |
| Node.js ≥ 20       | Entorno de ejecución del API.                             |
| Express 5          | Framework HTTP y definición de rutas.                     |
| TypeScript         | Tipado estático del servidor.                             |
| Zod 4              | Validación de body, params, query y variables de entorno. |
| PostgreSQL + `pg`  | Persistencia de datos y pool de conexiones.               |
| JSON Web Token     | Access tokens y refresh tokens.                           |
| bcryptjs           | Hash de contraseñas.                                      |
| cookie-parser      | Lectura y escritura de la cookie de refresh.              |
| Helmet             | Cabeceras de seguridad HTTP.                              |
| CORS               | Control de orígenes permitidos.                           |
| express-rate-limit | Limitación de peticiones en autenticación y feedback.     |
| Pino + pino-http   | Logging estructurado.                                     |
| Nodemailer         | Envío de emails de verificación, recuperación y feedback. |
| PDFKit             | Generación de reportes PDF.                               |
| tsup               | Build del API y del paquete compartido.                   |
| tsx                | Ejecución y recarga en desarrollo.                        |

### Base de datos

| Tecnología          | Uso                                                    |
| ------------------- | ------------------------------------------------------ |
| PostgreSQL          | Base de datos relacional.                              |
| SQL puro            | Definición de tablas, índices, constraints y triggers. |
| Migraciones propias | Runner en Node.js con registro en `schema_migrations`. |

### Herramientas y servicios adicionales

| Herramienta / servicio  | Uso                                              |
| ----------------------- | ------------------------------------------------ |
| npm workspaces          | Gestión del monorepo.                            |
| ESLint                  | Análisis estático del código.                    |
| Prettier                | Formato consistente de archivos.                 |
| Vitest                  | Pruebas unitarias y de integración.              |
| Testing Library + jsdom | Pruebas de componentes del frontend.             |
| Cloudinary              | Almacenamiento de avatares de usuario.           |
| SMTP                    | Envío de emails transaccionales y de feedback.   |
| concurrently            | Ejecución simultánea de API y web en desarrollo. |

### Infraestructura y despliegue

El repositorio **no incluye** archivos de despliegue como `Dockerfile`, `docker-compose`, `vercel.json`, `netlify.toml`, `render.yaml` ni workflows de CI/CD. Las instrucciones de build y los requisitos de producción se documentan en la sección [Despliegue](#despliegue).

---

## Arquitectura y estructura del proyecto

Meridia utiliza una arquitectura monorepo con dos aplicaciones principales (`api` y `web`) y un paquete compartido (`shared`). La base de datos se administra mediante migraciones SQL ubicadas en la raíz del repositorio.

### Estructura del monorepo

```text
meridia/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── config/          # Variables de entorno y carga de .env
│   │       ├── database/        # Pool de PostgreSQL y tipos de datos
│   │       ├── middlewares/     # Autenticación, validación, CSRF, errores, rate limit
│   │       ├── modules/         # Módulos de negocio del API
│   │       ├── shared/          # Errores, HTTP, logger, email y utilidades
│   │       ├── test/            # Configuración y helpers de pruebas
│   │       ├── app.ts           # Construcción de la aplicación Express
│   │       └── server.ts        # Arranque y cierre del servidor
│   └── web/
│       └── src/
│           ├── app/             # Providers y router
│           ├── auth/            # Estado de sesión y manejo de no autorizado
│           ├── components/      # Componentes de layout y UI reutilizable
│           ├── features/        # Funcionalidades organizadas por dominio
│           ├── hooks/           # Hooks compartidos
│           ├── routes/          # Rutas de TanStack Router
│           ├── services/        # Cliente HTTP, tokens y queries
│           ├── stores/          # Estado global con Zustand
│           ├── theme/           # Tema y estilos globales
│           ├── utils/           # Utilidades de formato y presentación
│           └── routeTree.gen.ts # Árbol de rutas generado (versionado)
├── packages/
│   └── shared/
│       └── src/                 # Tipos, enums y países compartidos
├── database/
│   ├── migrations/              # Migraciones SQL aplicadas en orden
│   ├── db-create.mjs            # Creación de la base local
│   └── migrate.mjs              # Runner de migraciones
├── package.json
└── tsconfig.base.json
```

### Backend

El API sigue una organización modular por dominio:

```text
modules/<módulo>/
├── <módulo>.routes.ts       # Definición de endpoints
├── <módulo>.controller.ts   # Adaptación HTTP
├── <módulo>.service.ts      # Reglas de negocio
├── <módulo>.repository.ts   # Consultas SQL
└── <módulo>.schemas.ts      # Validación con Zod
```

Los módulos actuales son: `auth`, `users`, `accounts`, `categories`, `transactions`, `transfers`, `dashboard`, `analytics`, `reminders`, `reports` y `feedback`.

Características de la arquitectura del API:

- El middleware `validate` reemplaza `req.params`, `req.query` o `req.body` con el resultado validado por Zod.
- Los identificadores principales son tipos branded (`UserId`, `AccountId`, `CategoryId`, `TransactionId`, etc.) definidos en `@meridia/shared`.
- Las respuestas exitosas usan el envelope `{ "success": true, "data": ... }`.
- Los errores usan el envelope `{ "success": false, "error": { "code", "message", "details" } }`.
- La conexión a PostgreSQL se realiza mediante un pool con un máximo de 10 conexiones.
- El endpoint de salud es `GET /health` (fuera del prefijo `/api`).

### Frontend

El frontend está organizado por funcionalidades dentro de `src/features`:

```text
features/<feature>/
├── components/      # Componentes específicos
├── hooks/           # Hooks de datos y mutaciones
├── pages/           # Páginas de la funcionalidad
├── services/        # Llamadas al API
├── utils/           # Utilidades y pruebas
└── validations.ts   # Esquemas de validación
```

Aspectos relevantes:

- Las rutas se definen con TanStack Router basado en archivos.
- `src/routeTree.gen.ts` se genera con `npm run routes:gen -w @meridia/web` y está versionado.
- TanStack Query maneja caché, reintentos e invalidación después de las mutaciones.
- El cliente Axios agrega el access token, renueva la sesión automáticamente y redirige al login si el refresh falla.
- El alias `@` apunta a `apps/web/src`.
- Los guards de las rutas privadas verifican la sesión antes de renderizar y redirigen según el estado de verificación del email.
- El tema y el estado de la interfaz se gestionan con Zustand y se persisten en `localStorage`.

### Paquete compartido

`@meridia/shared` contiene:

- Tipos de dominio y tipos branded para los identificadores.
- Enums de tipos de cuenta, movimientos, feedback y recurrencias.
- Etiquetas en español.
- Listado de países y monedas disponibles.

El paquete se compila en `dist/`, que está ignorado por Git. El script `postinstall` lo construye automáticamente después de `npm install`. Si se modifica su código fuente, es necesario ejecutar:

```bash
npm run build -w @meridia/shared
```

---

## API REST

La configuración de desarrollo usa `http://localhost:4000` (valor de `PORT` en el `.env` de la raíz). El frontend de Vite hace proxy de `/api` y `/health` hacia ese puerto.

### Endpoints principales

| Método   | Ruta                                             | Autenticación | Descripción                                            |
| -------- | ------------------------------------------------ | ------------- | ------------------------------------------------------ |
| `POST`   | `/api/auth/register`                             | Pública       | Registro de usuario.                                   |
| `POST`   | `/api/auth/login`                                | Pública       | Inicio de sesión.                                      |
| `POST`   | `/api/auth/verify-email`                         | Pública       | Verificación de email.                                 |
| `POST`   | `/api/auth/resend-verification`                  | Pública       | Reenvío del email de verificación.                     |
| `POST`   | `/api/auth/forgot-password`                      | Pública       | Solicitud de restablecimiento de contraseña.           |
| `POST`   | `/api/auth/reset-password`                       | Pública       | Restablecimiento con token.                            |
| `POST`   | `/api/auth/refresh`                              | Cookie        | Renovación de tokens.                                  |
| `POST`   | `/api/auth/logout`                               | Cookie        | Cierre de sesión.                                      |
| `GET`    | `/api/auth/me`                                   | Bearer        | Datos del usuario autenticado.                         |
| `PATCH`  | `/api/auth/me`                                   | Bearer        | Actualización de nombre y avatar.                      |
| `GET`    | `/api/accounts`                                  | Bearer        | Listado de cuentas.                                    |
| `POST`   | `/api/accounts`                                  | Bearer        | Creación de cuenta.                                    |
| `GET`    | `/api/accounts/:id`                              | Bearer        | Detalle de cuenta.                                     |
| `PATCH`  | `/api/accounts/:id`                              | Bearer        | Actualización de cuenta.                               |
| `DELETE` | `/api/accounts/:id`                              | Bearer        | Eliminación de cuenta.                                 |
| `GET`    | `/api/categories`                                | Bearer        | Listado de categorías; admite `?type=income\|expense`. |
| `POST`   | `/api/categories`                                | Bearer        | Creación de categoría.                                 |
| `GET`    | `/api/categories/:id`                            | Bearer        | Detalle de categoría.                                  |
| `PATCH`  | `/api/categories/:id`                            | Bearer        | Actualización de categoría.                            |
| `DELETE` | `/api/categories/:id`                            | Bearer        | Eliminación de categoría.                              |
| `GET`    | `/api/transactions`                              | Bearer        | Listado con filtros y paginación.                      |
| `POST`   | `/api/transactions`                              | Bearer        | Creación de movimiento.                                |
| `GET`    | `/api/transactions/:id`                          | Bearer        | Detalle de movimiento.                                 |
| `PATCH`  | `/api/transactions/:id`                          | Bearer        | Actualización de movimiento.                           |
| `DELETE` | `/api/transactions/:id`                          | Bearer        | Eliminación de movimiento.                             |
| `GET`    | `/api/transfers`                                 | Bearer        | Historial de transferencias.                           |
| `POST`   | `/api/transfers`                                 | Bearer        | Creación de transferencia.                             |
| `DELETE` | `/api/transfers/:id`                             | Bearer        | Eliminación de transferencia.                          |
| `GET`    | `/api/dashboard`                                 | Bearer        | Resumen del dashboard.                                 |
| `GET`    | `/api/analytics`                                 | Bearer        | Analítica anual.                                       |
| `GET`    | `/api/reminders`                                 | Bearer        | Recordatorios y ocurrencias por rango de fechas.       |
| `POST`   | `/api/reminders`                                 | Bearer        | Creación de recordatorio.                              |
| `PATCH`  | `/api/reminders/:id`                             | Bearer        | Actualización de recordatorio.                         |
| `DELETE` | `/api/reminders/:id`                             | Bearer        | Eliminación de recordatorio.                           |
| `PATCH`  | `/api/reminders/:id/occurrences/:occurrenceDate` | Bearer        | Actualización de una ocurrencia.                       |
| `DELETE` | `/api/reminders/:id/occurrences/:occurrenceDate` | Bearer        | Eliminación de una ocurrencia.                         |
| `POST`   | `/api/feedback`                                  | Bearer        | Envío de feedback.                                     |
| `GET`    | `/api/reports/transactions`                      | Bearer        | Reporte PDF o CSV de movimientos.                      |
| `GET`    | `/health`                                        | Pública       | Estado del API y de la base de datos.                  |

### Parámetros destacados

| Endpoint                        | Parámetros                                                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `GET /api/transactions`         | `from`, `to`, `accountId`, `categoryId`, `type`, `limit` (1-100), `offset`.                                            |
| `GET /api/dashboard`            | `from`, `to`, `limit` (1-50, por defecto 8).                                                                           |
| `GET /api/analytics`            | `year` (opcional).                                                                                                     |
| `GET /api/reminders`            | `from` y `to` obligatorios; el rango no puede superar 366 días.                                                        |
| `GET /api/reports/transactions` | `format=pdf\|csv`, `period=monthly\|annual\|custom`, `year`, `month`, `from`, `to`, `accountId`, `categoryId`, `type`. |

### Formato de respuesta

Respuesta exitosa:

```json
{
  "success": true,
  "data": {}
}
```

Listados:

```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 0
  }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descripción del error",
    "details": {}
  }
}
```

> El repositorio no incluye una especificación OpenAPI/Swagger generada. Los endpoints anteriores se obtienen directamente de los routers de Express.

---

## Requisitos previos

| Requisito           | Detalle                                                                                       |
| ------------------- | --------------------------------------------------------------------------------------------- |
| Node.js             | Versión 20 o superior (`engines.node` en `package.json`).                                     |
| npm                 | Necesario para instalar y ejecutar los workspaces.                                            |
| PostgreSQL          | Las migraciones usan `gen_random_uuid()`, disponible de forma nativa desde PostgreSQL 13.     |
| `psql` y `createdb` | Solo necesarios si se utiliza `npm run db:create` para crear la base local.                   |
| SMTP                | Opcional en desarrollo; obligatorio en producción para verificación, recuperación y feedback. |
| Cloudinary          | Opcional; necesario para habilitar la subida de avatares.                                     |

No se incluye configuración de Docker ni de contenedores en el repositorio.

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd meridia
```

> El clon local analizado no tiene un remoto Git configurado, por lo que la URL de clonado queda pendiente de completar.

### 2. Instalar dependencias

```bash
npm install
```

El script `postinstall` compila automáticamente `@meridia/shared`. Si la compilación falla o se modifica el paquete compartido, ejecutar:

```bash
npm run build -w @meridia/shared
```

### 3. Configurar las variables de entorno

Crear manualmente los archivos `.env` en la raíz y en `apps/web/`. El repositorio no incluye archivos `.env.example`.

- `.env` en la raíz: configuración del API y de la base de datos.
- `apps/web/.env`: variables expuestas al frontend por Vite.

Usar como referencia la sección [Variables de entorno](#variables-de-entorno). Nunca commitear archivos `.env` con credenciales reales.

### 4. Crear y migrar la base de datos

Si se utiliza una instancia local de PostgreSQL y el rol actual tiene permisos:

```bash
npm run db:create
npm run db:migrate
```

`db:create` crea la base `meridia_db` por defecto. Si la base ya existe o se utiliza un servicio externo, omitir ese comando y ejecutar únicamente las migraciones con el `DATABASE_URL` configurado.

Para consultar el estado de las migraciones:

```bash
node database/migrate.mjs status
```

### 5. Ejecutar la aplicación

Para iniciar API y frontend simultáneamente:

```bash
npm run dev
```

También es posible ejecutarlos por separado:

```bash
npm run dev:api
npm run dev:web
```

### 6. Acceder a la aplicación

| Servicio     | URL                            |
| ------------ | ------------------------------ |
| Frontend     | `http://localhost:5173`        |
| API          | `http://localhost:4000`        |
| Health check | `http://localhost:4000/health` |

> El proxy de Vite apunta a `http://localhost:4000`; por eso el API debe ejecutarse en el puerto `4000` durante el desarrollo (`PORT=4000`). En producción, `VITE_API_URL` debe apuntar a la URL pública del API si este se sirve en un origen distinto; si se usa el mismo origen, puede quedar vacío.

### 7. Verificar el primer usuario

1. Abrir `http://localhost:5173/register` y crear una cuenta.
2. Meridia envía un email de verificación.
3. Si SMTP no está configurado, el enlace de verificación se escribe en los logs del API.
4. Verificar el email y luego iniciar sesión en `http://localhost:5173/login`.

---

## Variables de entorno

### Backend

El API busca el archivo `.env` en la raíz del repositorio y valida todas las variables con Zod al iniciar. Si una variable obligatoria falta o es inválida, el proceso termina.

#### Configuración general y base de datos

| Variable       | Obligatoria | Valor por defecto       | Descripción                                                                        | Ejemplo                                                         |
| -------------- | ----------- | ----------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `NODE_ENV`     | No          | `development`           | Entorno de ejecución: `development`, `test` o `production`.                        | `development`                                                   |
| `PORT`         | No          | `3000`                  | Puerto del API. En desarrollo debe ser `4000` para coincidir con el proxy de Vite. | `4000`                                                          |
| `CORS_ORIGIN`  | No          | `http://localhost:5173` | Orígenes permitidos, separados por coma.                                           | `http://localhost:5173`                                         |
| `DATABASE_URL` | **Sí**      | —                       | Cadena de conexión a PostgreSQL.                                                   | `postgresql://meridia_user:change_me@localhost:5432/meridia_db` |
| `PG_SSL`       | No          | `false`                 | Activa SSL en la conexión a PostgreSQL.                                            | `false`                                                         |

#### Autenticación y seguridad

| Variable                 | Obligatoria | Valor por defecto | Descripción                                                 | Ejemplo                          |
| ------------------------ | ----------- | ----------------- | ----------------------------------------------------------- | -------------------------------- |
| `JWT_ACCESS_SECRET`      | **Sí**      | —                 | Secreto del access token; mínimo 16 caracteres.             | `cambia_este_secreto_de_acceso`  |
| `JWT_REFRESH_SECRET`     | **Sí**      | —                 | Secreto del refresh token; mínimo 16 caracteres.            | `cambia_este_secreto_de_refresh` |
| `JWT_ACCESS_EXPIRES_IN`  | No          | `15m`             | Duración del access token.                                  | `15m`                            |
| `JWT_REFRESH_EXPIRES_IN` | No          | `30d`             | Duración del refresh token.                                 | `30d`                            |
| `COOKIE_SECURE`          | No          | `false`           | Envía la cookie de refresh solo por HTTPS.                  | `false`                          |
| `COOKIE_SAME_SITE`       | No          | `lax`             | Política `SameSite` de la cookie: `lax`, `strict` o `none`. | `lax`                            |
| `COOKIE_NAME`            | No          | `meridia_refresh` | Nombre de la cookie de refresh.                             | `meridia_refresh`                |
| `COOKIE_DOMAIN`          | No          | `.localhost`      | Dominio de la cookie de refresh.                            | `.localhost`                     |

#### Rate limiting

| Variable                             | Obligatoria | Valor por defecto | Descripción                                            | Ejemplo  |
| ------------------------------------ | ----------- | ----------------- | ------------------------------------------------------ | -------- |
| `RATE_LIMIT_WINDOW_MS`               | No          | `900000`          | Ventana de rate limiting en milisegundos (15 minutos). | `900000` |
| `RATE_LIMIT_MAX`                     | No          | `20`              | Máximo de solicitudes por ventana para autenticación.  | `20`     |
| `REGISTER_RATE_LIMIT_MAX`            | No          | `5`               | Máximo de registros por hora.                          | `5`      |
| `RESEND_VERIFICATION_RATE_LIMIT_MAX` | No          | `3`               | Máximo de reenvíos de verificación por ventana.        | `3`      |
| `FORGOT_PASSWORD_RATE_LIMIT_MAX`     | No          | `5`               | Máximo de solicitudes de recuperación por ventana.     | `5`      |
| `FEEDBACK_RATE_LIMIT_MAX`            | No          | `5`               | Máximo de envíos de feedback por ventana.              | `5`      |

#### Cloudinary

| Variable                | Obligatoria | Valor por defecto | Descripción                     | Ejemplo               |
| ----------------------- | ----------- | ----------------- | ------------------------------- | --------------------- |
| `CLOUDINARY_CLOUD_NAME` | No          | —                 | Nombre del cloud de Cloudinary. | `mi_cloud`            |
| `CLOUDINARY_API_KEY`    | No          | —                 | API key de Cloudinary.          | `123456789012345`     |
| `CLOUDINARY_API_SECRET` | No          | —                 | API secret de Cloudinary.       | `cambia_este_secreto` |

> El backend usa estas credenciales para eliminar avatares anteriores. La subida se realiza directamente desde el frontend con las variables `VITE_CLOUDINARY_*`.

#### Email y verificación

| Variable                               | Obligatoria                             | Valor por defecto              | Descripción                                                   | Ejemplo                          |
| -------------------------------------- | --------------------------------------- | ------------------------------ | ------------------------------------------------------------- | -------------------------------- |
| `WEB_APP_URL`                          | No                                      | `http://localhost:5173`        | URL pública del frontend usada en enlaces de email.           | `https://app.example.com`        |
| `SMTP_HOST`                            | No en desarrollo / **Sí en producción** | —                              | Host SMTP.                                                    | `smtp.example.com`               |
| `SMTP_PORT`                            | No                                      | `587`                          | Puerto SMTP.                                                  | `587`                            |
| `SMTP_SECURE`                          | No                                      | `false`                        | Usa conexión SMTP segura.                                     | `false`                          |
| `SMTP_USER`                            | No                                      | —                              | Usuario SMTP.                                                 | `usuario_smtp`                   |
| `SMTP_PASS`                            | No                                      | —                              | Contraseña SMTP.                                              | `cambia_esta_contrasena`         |
| `SMTP_FROM`                            | No en desarrollo / **Sí en producción** | `Meridia <no-reply@localhost>` | Remitente de los emails.                                      | `Meridia <no-reply@example.com>` |
| `FEEDBACK_TO_EMAIL`                    | No en desarrollo / **Sí en producción** | —                              | Destinatario de los mensajes de feedback.                     | `feedback@example.com`           |
| `EMAIL_VERIFICATION_TTL_HOURS`         | No                                      | `24`                           | Vigencia del token de verificación, en horas.                 | `24`                             |
| `VERIFICATION_RESEND_COOLDOWN_SECONDS` | No                                      | `60`                           | Espera mínima entre reenvíos de verificación, en segundos.    | `60`                             |
| `PASSWORD_RESET_TTL_MINUTES`           | No                                      | `60`                           | Vigencia del token de recuperación, en minutos.               | `60`                             |
| `PASSWORD_RESET_COOLDOWN_SECONDS`      | No                                      | `60`                           | Espera mínima entre solicitudes de recuperación, en segundos. | `60`                             |

#### Ejemplo mínimo para desarrollo

```dotenv
NODE_ENV=development
PORT=4000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://meridia_user:change_me@localhost:5432/meridia_db
PG_SSL=false

JWT_ACCESS_SECRET=cambia_este_secreto_de_acceso
JWT_REFRESH_SECRET=cambia_este_secreto_de_refresh
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
COOKIE_NAME=meridia_refresh
COOKIE_DOMAIN=.localhost

WEB_APP_URL=http://localhost:5173
```

> Los valores anteriores son ejemplos ficticios. No usar secretos reales en documentación ni en el repositorio.

### Frontend

| Variable                        | Obligatoria | Valor por defecto | Descripción                                                                                                                                        | Ejemplo                   |
| ------------------------------- | ----------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `VITE_API_URL`                  | No          | Vacío             | URL base del API. Si está vacía, se usan rutas relativas y el proxy de Vite en desarrollo. Debe estar vacía o comenzar con `http://` o `https://`. | `https://api.example.com` |
| `VITE_CLOUDINARY_CLOUD_NAME`    | No          | —                 | Cloud name de Cloudinary para la subida de avatares.                                                                                               | `mi_cloud`                |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | No          | —                 | Preset de subida de Cloudinary.                                                                                                                    | `meridia_preset`          |

Ejemplo para desarrollo:

```dotenv
VITE_API_URL=
VITE_CLOUDINARY_CLOUD_NAME=mi_cloud
VITE_CLOUDINARY_UPLOAD_PRESET=meridia_preset
```

> Las variables `VITE_*` se incorporan en tiempo de build. Para producción deben configurarse antes de ejecutar el build del frontend.

---

## Base de datos

Meridia utiliza PostgreSQL. La conexión se configura con `DATABASE_URL`; el pool del API admite hasta 10 conexiones, cierra conexiones inactivas después de 30 segundos y activa SSL cuando `PG_SSL=true`.

Las fechas `DATE` se convierten a cadenas `YYYY-MM-DD` para evitar problemas de zona horaria.

### Tablas principales

| Tabla                       | Propósito                                                             |
| --------------------------- | --------------------------------------------------------------------- |
| `users`                     | Usuarios, credenciales, país, moneda, avatar y verificación de email. |
| `refresh_tokens`            | Refresh tokens hasheados y su estado de revocación.                   |
| `email_verification_tokens` | Tokens de verificación de email.                                      |
| `password_reset_tokens`     | Tokens de restablecimiento de contraseña.                             |
| `accounts`                  | Cuentas financieras del usuario.                                      |
| `categories`                | Categorías de ingresos y gastos.                                      |
| `transactions`              | Movimientos de ingresos y gastos.                                     |
| `account_transfers`         | Transferencias entre cuentas.                                         |
| `reminders`                 | Recordatorios y reglas de recurrencia.                                |
| `reminder_occurrences`      | Ocurrencias concretas de cada recordatorio.                           |
| `feedback`                  | Mensajes enviados desde el formulario de feedback.                    |
| `schema_migrations`         | Registro de migraciones aplicadas.                                    |

### Migraciones

Las migraciones están en `database/migrations/` y se aplican en orden alfabético dentro de una transacción. Cada migración aplicada se registra en `schema_migrations`.

```bash
# Aplicar migraciones pendientes
npm run db:migrate

# Ver el estado de las migraciones
node database/migrate.mjs status

# Desmarcar la última migración aplicada
npm run db:migrate:down
```

> **Importante:** `db:migrate:down` solo elimina el registro de la última migración de `schema_migrations`; **no revierte el SQL**. Para deshacer cambios estructurales es necesario crear una migración manual.

### Datos iniciales

- Al verificar el email, se crean automáticamente 12 categorías predeterminadas (4 de ingresos y 8 de gastos).
- No se encontró un script de seed independiente para datos de demostración.
- Las bases de datos de prueba se crean y migran automáticamente durante la ejecución de los tests del API.

---

## Scripts disponibles

### Scripts de la raíz

| Comando                   | Descripción                                                 |
| ------------------------- | ----------------------------------------------------------- |
| `npm run dev`             | Ejecuta API y frontend con `concurrently`.                  |
| `npm run dev:api`         | Ejecuta únicamente el API en modo desarrollo.               |
| `npm run dev:web`         | Ejecuta únicamente el frontend con Vite.                    |
| `npm run build`           | Compila el paquete compartido y todos los workspaces.       |
| `npm run lint`            | Ejecuta ESLint en todos los workspaces.                     |
| `npm run format`          | Formatea el repositorio con Prettier.                       |
| `npm run format:check`    | Verifica el formato sin modificar archivos.                 |
| `npm test`                | Ejecuta las pruebas de todos los workspaces.                |
| `npm run test:watch`      | Ejecuta las pruebas en modo watch.                          |
| `npm run test:coverage`   | Genera cobertura de pruebas.                                |
| `npm run db:create`       | Crea la base local (por defecto `meridia_db`).              |
| `npm run db:migrate`      | Aplica las migraciones pendientes.                          |
| `npm run db:migrate:down` | Desmarca la última migración aplicada.                      |
| `postinstall`             | Compila `@meridia/shared` después de instalar dependencias. |

### Scripts por workspace

| Comando                                | Descripción                                        |
| -------------------------------------- | -------------------------------------------------- |
| `npm run build -w @meridia/api`        | Compila el API en `apps/api/dist`.                 |
| `npm run start -w @meridia/api`        | Inicia el API compilado con `node dist/server.js`. |
| `npm run typecheck -w @meridia/api`    | Verifica tipos del API.                            |
| `npm run test -w @meridia/api`         | Ejecuta las pruebas del API.                       |
| `npm run build -w @meridia/web`        | Compila el frontend en `apps/web/dist`.            |
| `npm run preview -w @meridia/web`      | Sirve localmente el build del frontend.            |
| `npm run typecheck -w @meridia/web`    | Verifica tipos del frontend.                       |
| `npm run routes:gen -w @meridia/web`   | Regenera `src/routeTree.gen.ts`.                   |
| `npm run test -w @meridia/web`         | Ejecuta las pruebas del frontend.                  |
| `npm run build -w @meridia/shared`     | Compila el paquete compartido.                     |
| `npm run typecheck -w @meridia/shared` | Verifica tipos del paquete compartido.             |

---

## Pruebas y calidad

### Pruebas

```bash
# Todas las pruebas
npm test

# Cobertura
npm run test:coverage

# API
npm run test -w @meridia/api

# Frontend
npm run test -w @meridia/web
```

Consideraciones:

- Las pruebas del API requieren PostgreSQL y el archivo `.env` de la raíz.
- El `globalSetup` crea automáticamente la base `meridia_test` y aplica las migraciones.
- El rol de PostgreSQL debe tener permisos para crear bases de datos.
- La configuración del API usa `fileParallelism: false` porque las pruebas comparten `meridia_test` y las tablas se limpian entre casos.
- Las pruebas del frontend usan `jsdom`, Vitest y Testing Library.

### Linting y formato

```bash
npm run lint
npm run format:check
npm run format
```

### Verificación de tipos

El `package.json` raíz no define un script global de typecheck; debe ejecutarse por workspace:

```bash
npm run typecheck -w @meridia/shared
npm run typecheck -w @meridia/api
npm run typecheck -w @meridia/web
```

> El frontend requiere que `src/routeTree.gen.ts` exista. Si falta o está desactualizado, ejecutar `npm run routes:gen -w @meridia/web`.

---

## Despliegue

El repositorio no contiene una configuración de despliegue verificable para una plataforma específica. Esta sección documenta el proceso de build y los requisitos que se desprenden del código.

### Build de producción

```bash
npm ci
npm run build
```

El build genera:

| Artefacto          | Ubicación               |
| ------------------ | ----------------------- |
| API compilado      | `apps/api/dist/`        |
| Frontend estático  | `apps/web/dist/`        |
| Paquete compartido | `packages/shared/dist/` |

### Iniciar el API

```bash
NODE_ENV=production npm run start -w @meridia/api
```

El API compilado se ejecuta desde `apps/api/dist/server.js`. Antes de iniciarlo, aplicar las migraciones pendientes.

### Servir el frontend

El contenido de `apps/web/dist/` debe publicarse como sitio estático. Al ser una SPA con enrutamiento del lado del cliente, el servidor debe redirigir las rutas desconocidas a `index.html`.

Para una vista previa local del build:

```bash
npm run preview -w @meridia/web
```

### Checklist de producción

- Configurar `NODE_ENV=production`.
- Definir `DATABASE_URL` y, si el proveedor lo requiere, `PG_SSL=true`.
- Usar secretos JWT robustos y distintos entre sí.
- Configurar `CORS_ORIGIN` con el o los orígenes exactos del frontend.
- Configurar `COOKIE_SECURE=true` y ajustar `COOKIE_SAME_SITE`/`COOKIE_DOMAIN` según la topología de dominios.
- Definir `WEB_APP_URL` con la URL pública del frontend para los enlaces de email.
- Configurar `SMTP_HOST`, `SMTP_FROM` y `FEEDBACK_TO_EMAIL`; son obligatorios en producción.
- Configurar Cloudinary si se desea habilitar la gestión de avatares.
- Configurar `VITE_API_URL` con la URL pública del API si frontend y API se sirven en orígenes distintos; se incorpora en tiempo de build.
- Ejecutar las migraciones antes del arranque del API.
- Verificar `GET /health` después del despliegue.

> En producción, la validación de variables de entorno exige `SMTP_HOST`, `SMTP_FROM` y `FEEDBACK_TO_EMAIL`. Si frontend y API se alojan en dominios distintos, revisar la configuración de cookies y CORS.

---

## Capturas de pantalla

Actualmente el repositorio **no incluye capturas de pantalla**. Cuando se agreguen, se propone guardarlas en `docs/screenshots/` y usar rutas relativas como las siguientes:

| Vista            | Ruta de la aplicación | Captura sugerida                    |
| ---------------- | --------------------- | ----------------------------------- |
| Landing          | `/`                   | `docs/screenshots/home.png`         |
| Inicio de sesión | `/login`              | `docs/screenshots/login.png`        |
| Registro         | `/register`           | `docs/screenshots/register.png`     |
| Dashboard        | `/app/dashboard`      | `docs/screenshots/dashboard.png`    |
| Cuentas          | `/app/accounts`       | `docs/screenshots/accounts.png`     |
| Movimientos      | `/app/transactions`   | `docs/screenshots/transactions.png` |
| Categorías       | `/app/categories`     | `docs/screenshots/categories.png`   |
| Analítica        | `/app/analytics`      | `docs/screenshots/analytics.png`    |
| Calendario       | `/app/calendar`       | `docs/screenshots/calendar.png`     |
| Reportes         | `/app/reports`        | `docs/screenshots/reports.png`      |
| Perfil           | `/app/profile`        | `docs/screenshots/profile.png`      |

Ejemplo de referencia una vez añadidas las imágenes:

```markdown
![Dashboard](docs/screenshots/dashboard.png)
```

> Las rutas anteriores son propuestas; los archivos de imagen aún no forman parte del repositorio.

---

## Autoría y licencia

### Desarrollador

**José Alejandro Méndez Sánchez**  
Ingeniero de Software

- Sitio web: [https://alodor.vercel.app/](https://alodor.vercel.app/)
- Proyecto: Meridia, versión 1.0.0

### Licencia

Este proyecto se distribuye bajo la **Licencia MIT**. El texto completo está disponible en el archivo [`LICENSE`](LICENSE).

Copyright (c) 2026 José Alejandro Méndez Sánchez.

La licencia permite usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del software, siempre que se incluya el aviso de copyright y el texto de la licencia en todas las copias o partes sustanciales del software. El software se proporciona **«tal cual»**, sin garantías de ningún tipo, y los autores no se hacen responsables de reclamaciones, daños u otras responsabilidades derivadas de su uso.

---

## Estado del proyecto

### Implementado

- ✅ Autenticación con verificación de email, refresh tokens y recuperación de contraseña.
- ✅ Perfil de usuario con nombre y avatar en Cloudinary.
- ✅ Gestión de cuentas y transferencias entre cuentas compatibles.
- ✅ Gestión de categorías de ingresos y gastos.
- ✅ Registro, edición, eliminación, filtrado y paginación de movimientos.
- ✅ Dashboard mensual con comparaciones y gráficos.
- ✅ Analítica anual y trimestral.
- ✅ Reportes PDF y CSV.
- ✅ Calendario de recordatorios recurrentes y notificaciones internas.
- ✅ Formulario de feedback con notificación por email cuando SMTP está configurado.
- ✅ Tema claro/oscuro y diseño responsive.
- ✅ Pruebas automatizadas para API y frontend.
- ✅ Licencia MIT.

### Pendiente de completar en el repositorio

- ⚠️ Configuración de despliegue para producción (Docker, plataforma cloud, CI/CD).
- ⚠️ Capturas de pantalla de las vistas principales.
- ⚠️ URL oficial del repositorio remoto.

---

<p align="center">
  <sub>Documentación basada en el estado actual del código de Meridia.</sub>
</p>
