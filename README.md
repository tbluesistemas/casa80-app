# Casa80 App

> Sistema de gestión de reservas, inventario y clientes para **Casa80 Eventos** — Barranquilla, Colombia.

---

## 📋 Descripción

**Casa80 App** es una aplicación web full-stack diseñada para administrar el alquiler de mobiliario para eventos. Permite gestionar el ciclo de vida completo de una reserva: desde la creación y confirmación hasta el despacho, devolución y registro de daños. Incluye control de inventario en tiempo real, gestión de clientes, panel de dashboard con estadísticas y exportación de datos a Excel.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) |
| **UI** | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| **Estilos** | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| **Base de datos** | [PostgreSQL](https://www.postgresql.org) vía [Prisma ORM](https://www.prisma.io) |
| **Autenticación** | [NextAuth.js v5](https://authjs.dev) (Credentials + JWT) |
| **Email** | [Nodemailer](https://nodemailer.com) (SMTP) |
| **Gráficas** | [Recharts](https://recharts.org) |
| **Excel** | [SheetJS (xlsx)](https://sheetjs.com) |
| **Iconos** | [Lucide React](https://lucide.dev) |
| **Fechas** | [date-fns](https://date-fns.org) |
| **Notificaciones** | [Sonner](https://sonner.emilkowal.ski) |
| **Deploy** | [Vercel](https://vercel.com) |

---

## ✨ Funcionalidades

- **Gestión de Reservas (Eventos)**: Crear, editar, ver detalle y cambiar el estado de cada reserva.
- **Ciclo de vida del evento**: `SIN_CONFIRMAR → RESERVADO → DESPACHADO → COMPLETADO` (con opción de `CANCELADO`). Cada cambio queda registrado en un historial con usuario, fecha y motivo.
- **Inventario Dinámico**: La disponibilidad de cada producto se calcula en tiempo real según el rango de fechas seleccionado, descontando eventos activos solapados.
- **Registro de Devoluciones**: Registro de artículos devueltos en buen estado y dañados. Los daños actualizan el stock automáticamente.
- **Historial de Movimientos**: Log completo por producto (COMPRA, AJUSTE, DEVOLUCIÓN, USO EN EVENTO).
- **Gestión de Clientes**: Registro completo con datos de contacto y dirección (departamento, ciudad, barrio). Información sensible enmascarada para usuarios con rol VIEWER.
- **Dashboard con Estadísticas**: Ingresos, eventos por estado, productos más alquilados, historial de daños — filtrable por año y mes.
- **Notificación por Email**: Al crear una reserva se envía automáticamente un email de confirmación con los detalles al cliente.
- **Exportación a Excel**: Exporta eventos, inventario, clientes y daños en formato `.xlsx`.
- **Importación de Inventario**: Carga masiva de productos desde un archivo Excel.
- **Sistema de Roles**: `ADMIN` (acceso total) y `VIEWER` (solo lectura, datos sensibles enmascarados).
- **Modo Oscuro / Claro**: Alternancia de tema con persistencia.
- **Impresión de Reservas**: Imprime directamente los detalles de una reserva desde el navegador.

---

## 🗂️ Estructura del Proyecto

```
Casa80-app/
├── app/                        # Rutas (Next.js App Router)
│   ├── layout.tsx              # Layout raíz
│   ├── page.tsx                # Redirección a /inicio
│   ├── globals.css             # Estilos globales
│   ├── theme.css               # Variables del tema
│   ├── login/                  # Página de login
│   ├── inicio/                 # Dashboard principal
│   ├── events/                 # Lista y gestión de eventos
│   │   ├── new/                # Nueva reserva
│   │   └── [id]/               # Detalle, edición y devolución
│   ├── inventory/              # Gestión de inventario
│   ├── clients/                # Gestión de clientes
│   ├── admin/users/            # Administración de usuarios
│   └── api/auth/               # Endpoints de NextAuth
│
├── components/                 # Componentes React
│   ├── ui/                     # Primitivos UI (shadcn/ui + Radix)
│   ├── inventory/              # Componentes de inventario
│   ├── events/                 # Badges, controles de estado, impresión
│   ├── dashboard/              # Gráficas y filtros del dashboard
│   ├── admin/                  # Lista y gestión de usuarios
│   ├── export/                 # Componentes de exportación a Excel
│   ├── import/                 # Componentes de importación desde Excel
│   ├── booking-form.tsx        # Formulario de nueva reserva
│   ├── edit-event-form.tsx     # Formulario de edición de reserva
│   ├── events-list.tsx         # Tabla de eventos con historial
│   ├── client-selector.tsx     # Selector / creador de clientes
│   ├── return-form.tsx         # Formulario de devolución
│   ├── sidebar.tsx             # Navegación lateral
│   ├── auth-provider.tsx       # Context de autenticación
│   └── app-shell.tsx           # Estructura base de la app
│
├── lib/                        # Lógica de negocio
│   ├── actions.ts              # Server Actions (38 funciones)
│   ├── prisma.ts               # Singleton del cliente Prisma
│   ├── auth.ts                 # Helper de roles
│   ├── permissions.ts          # Enmascaramiento de datos sensibles
│   ├── event-status.ts         # Tipo EventStatus y máquina de estados
│   ├── email.ts                # Servicio de email (Nodemailer)
│   ├── colombia-data.ts        # Departamentos y municipios de Colombia
│   ├── excel-export.ts         # Generación de archivos Excel
│   └── excel-import.ts         # Lectura e importación de Excel
│
├── prisma/
│   ├── schema.prisma           # Esquema de base de datos
│   ├── seed.ts                 # Datos iniciales
│   └── migrations/             # Historial de migraciones
│
├── scripts/                    # Scripts de mantenimiento
│   ├── backup-db.ts
│   ├── check-db.ts
│   ├── update-prices.ts
│   └── ...
│
├── auth.ts                     # Configuración de NextAuth
├── auth.config.ts
├── middleware.ts               # Protección global de rutas
└── next-auth.d.ts              # Tipado extendido de sesión
```

---

## 🗄️ Modelos de Base de Datos

```
User          → Usuarios del sistema (ADMIN / VIEWER)
Product       → Productos del inventario (muebles)
Client        → Clientes con datos de contacto y dirección
Event         → Reservas/Eventos con fechas, estado y depósito
EventItem     → Relación N:M entre Event y Product (con devoluciones y daños)
InventoryLog  → Historial de movimientos de inventario por producto
EventHistory  → Historial de cambios de estado de cada evento
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@host:5432/nombre_db"

# NextAuth
AUTH_SECRET="tu_secreto_aleatorio_de_al_menos_32_caracteres"
NEXTAUTH_URL="http://localhost:3000"

# Email SMTP (opcional — para notificaciones de reserva)
SMTP_HOST="smtp.tuproveedor.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="tu@email.com"
SMTP_PASS="tu_contraseña_smtp"
SMTP_FROM="\"Casa80 Reservas\" <no-reply@casa80.com>"
```

---

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
- [Node.js](https://nodejs.org) >= 18
- [PostgreSQL](https://www.postgresql.org) >= 14

### 1. Clonar el repositorio

```bash
git clone https://github.com/tbluesistemas/casa80-app.git
cd casa80-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env .env.local
# Editar .env.local con tus credenciales
```

### 4. Inicializar la base de datos

```bash
# Generar el cliente Prisma
npx prisma generate

# Crear las tablas en la BD
npx prisma migrate deploy

# (Opcional) Sembrar datos de ejemplo
npx prisma db seed
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el cliente Prisma y compila para producción |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npx prisma studio` | Abre el explorador visual de la BD |
| `npx prisma migrate dev` | Crea y aplica una migración nueva |
| `npx prisma db seed` | Siembra datos iniciales |
| `npx tsx scripts/backup-db.ts` | Realiza un backup de la BD |
| `npx tsx scripts/check-db.ts` | Verifica la conexión a la BD |
| `npx tsx scripts/update-prices.ts` | Actualización masiva de precios |

---

## 🔐 Autenticación y Roles

La autenticación usa **NextAuth.js v5** con proveedor **Credentials** (email + contraseña hasheada con bcryptjs).

| Rol | Descripción |
|---|---|
| `ADMIN` | Acceso total: puede crear, editar y eliminar productos, eventos, clientes y usuarios |
| `VIEWER` | Solo lectura. Los datos sensibles (teléfono, email, documento, dirección) aparecen enmascarados |

El middleware (`middleware.ts`) protege todas las rutas excepto `/login` y `/api`. Los usuarios no autenticados son redirigidos automáticamente a `/login`.

---

## 📊 Ciclo de Vida de un Evento

```
CREAR           SIN_CONFIRMAR
                    │
                    ├──→ CANCELADO
                    │
                    ↓
               RESERVADO
                    │
                    ├──→ CANCELADO
                    │
                    ↓
              DESPACHADO
                    │
                    ↓
              COMPLETADO
```

Cada transición queda registrada en la tabla `EventHistory` con el usuario que hizo el cambio, la fecha y un motivo opcional.

---

## 📦 Despliegue en Vercel

1. Conecta el repositorio a [Vercel](https://vercel.com).
2. Configura las variables de entorno en el panel de Vercel.
3. Vercel ejecuta automáticamente `npm run build` (`prisma generate && next build`).

> [!NOTE]
> El `schema.prisma` incluye el target `rhel-openssl-3.0.x` para compatibilidad con el runtime de Vercel (Linux).

---

## 📄 Licencia

Proyecto privado — © 2025 **Casa80 Eventos**. Todos los derechos reservados.
