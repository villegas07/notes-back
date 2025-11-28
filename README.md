<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Notes Backend API

Sistema de gestión de notas con autenticación JWT, construido con NestJS, PostgreSQL y Prisma ORM siguiendo principios de arquitectura limpia y TDD.

## Características

### Fase 1 - CRUD de Notas
- Crear notas
- Editar notas
- Eliminar notas
- Archivar/Desarchivar notas
- Listar notas activas
- Listar notas archivadas

### Fase 2 - Gestión de Categorías
- Asignar categorías a notas
- Eliminar categorías de notas
- Filtrar notas por categoría
- Crear categorías
- Listar categorías

#### Autenticación
- Sign Up con email/password
- Sign In con JWT
- Protección de rutas con JWT Guard

### Requisitos

- **Node.js**: 20.x o superior
- **npm**: 10.x o superior
- **Docker**: 24.x o superior
- **Docker Compose**: 2.x o superior
- **PostgreSQL**: 16 (en contenedor)

## Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

#### Windows (PowerShell)
```powershell
# Ejecutar el script de inicio
.\run.ps1
```

#### Linux/macOS (Bash)
```bash
# Dar permisos de ejecución
chmod +x run.sh

# Ejecutar el script de inicio
./run.sh
```

### Opción 2: Manualmente

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd notes
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Crear archivo .env**
```bash
cp .env.example .env
```

4. **Iniciar Docker**
```bash
docker compose up -d
```

5. **Ejecutar migraciones de Prisma**
```bash
docker compose exec backend npx prisma migrate deploy
```

6. **Generar cliente de Prisma**
```bash
docker compose exec backend npx prisma generate
```

7. **Iniciar en desarrollo**
```bash
npm run start:dev
```

## Variables de Entorno

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notes"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"
PORT=3000
```

## Comandos npm

```bash
# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run start
npm run start:prod

# Build
npm run build

# Tests
npm test                # Ejecutar tests unitarios
npm run test:watch     # Tests en modo watch
npm run test:cov       # Tests con cobertura
npm run test:debug     # Tests en modo debug

# E2E Tests
npm run test:e2e

# Linting
npm run lint           # Verificar código
npm run format         # Formatear código
```

## Endpoints de la API

### Autenticación
```
POST   /auth/sign-up              # Crear cuenta
POST   /auth/sign-in              # Iniciar sesión
```

### Notas (Requiere autenticación JWT)
```
POST   /notes                      # Crear nota
GET    /notes/active              # Listar notas activas
GET    /notes/archived            # Listar notas archivadas
PUT    /notes/:id                 # Actualizar nota
POST   /notes/:id/archive         # Archivar nota
POST   /notes/:id/unarchive       # Desarchivar nota
DELETE /notes/:id                 # Eliminar nota
```

### Categorías (Requiere autenticación JWT)
```
POST   /categories                 # Crear categoría
GET    /categories                 # Listar todas las categorías
POST   /categories/:noteId/add/:categoryId      # Asignar categoría a nota
DELETE /categories/:noteId/remove/:categoryId   # Remover categoría de nota
GET    /categories/note/:noteId    # Obtener categorías de una nota
GET    /categories/filter/:categoryId # Obtener notas de una categoría
```

## Estructura del Proyecto

```
/src
  /modules
    /auth              # Autenticación (login/signup)
    /users             # Gestión de usuarios
    /notes             # CRUD de notas
    /categories        # Gestión de categorías
  /core
    /exceptions        # Excepciones personalizadas
    /guards            # Guards de autenticación
    /interceptors      # Interceptores globales
    /security          # Servicios de seguridad
  /database
    /prisma.service.ts # Servicio de Prisma
  /common
    /dto               # Data Transfer Objects
    /interfaces        # Interfaces compartidas
    /utils             # Utilidades generales
  app.module.ts        # Módulo raíz
  main.ts              # Punto de entrada
/prisma
  schema.prisma        # Esquema de base de datos
/test
  /e2e                 # Tests end-to-end
/docker-compose.yml    # Configuración Docker
/Dockerfile            # Imagen Docker
```

## Arquitectura

### Principios Aplicados

- **SOLID**: Responsabilidad única, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **Clean Architecture**: Separación clara de capas
- **DRY**: No repetir código
- **TDD**: Test-Driven Development obligatorio

### Capas

1. **Controllers** → Entrada HTTP y validación
2. **Services** → Lógica de negocio
3. **Repositories** → Acceso a datos
4. **DTOs** → Transferencia de datos con validación

### Seguridad

- Hash de contraseñas con **bcryptjs** (10 rondas)
- Autenticación con **JWT** (24h expiración)
- Validación de entrada con **class-validator**
- Guard de JWT en rutas protegidas
- Variables sensibles en **.env** (no versionadas)

## Base de Datos

### Motor
- **PostgreSQL 16** en contenedor Docker

### ORM
- **Prisma 5.20.0** con migraciones versionadas

### Modelos

```prisma
User
├── id (UUID)
├── email (unique)
├── password (hashed)
├── firstName
├── lastName
└── notes (relation)

Note
├── id (UUID)
├── title
├── description (optional)
├── isArchived
├── userId (FK)
└── categories (relation)

Category
├── id (UUID)
├── name (unique)
└── notes (relation)

NoteCategory (pivot table)
├── noteId (FK)
└── categoryId (FK)
```

### Ejecución de Migraciones

```bash
# Crear nueva migración
docker compose exec backend npx prisma migrate dev --name <migration-name>

# Aplicar migraciones pendientes
docker compose exec backend npx prisma migrate deploy

# Resetear BD (desarrollo solo)
docker compose exec backend npx prisma migrate reset

# Ver estado de migraciones
docker compose exec backend npx prisma migrate status
```

## Testing

### Estrategia TDD

1. Escribir tests primero (RED)
2. Implementar lógica mínima (GREEN)
3. Refactorizar

### Tipos de Tests

- **Unitarios**: Servicios, repositorios, lógica de negocio
- **Integración**: Repositorios con Prisma
- **E2E**: Endpoints completos

### Cobertura

Objetivo: ≥ 90%

```bash
npm run test:cov
```

## Docker

### Comandos

```bash
# Iniciar contenedores
docker compose up -d

# Ver logs
docker compose logs -f

# Detener contenedores
docker compose down

# Ejecutar comando en contenedor
docker compose exec backend <comando>

# Rebuild imagen
docker compose up -d --build
```

### Volumes

- **postgres_data**: Persistencia de datos PostgreSQL
- **.** (bind mount): Código en desarrollo (hot-reload)

## Estándares de Código

### Nomenclatura

- Variables y funciones: **camelCase**
- Clases, DTOs, Entidades: **PascalCase**
- Constantes: **UPPER_SNAKE_CASE**

### Linting

```bash
npm run lint        # Verificar
npm run lint -- --fix  # Arreglar automáticamente
```

### Formateo

```bash
npm run format
```

## Solución de Problemas

### Puertos en uso

Si los puertos 3000 o 5432 están en uso:

1. **Linux/macOS**: `lsof -i :3000` y `kill -9 <PID>`
2. **Windows**: `netstat -ano | findstr :3000` y `taskkill /PID <PID> /F`

O cambiar en `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Cambiar puerto externo
  - "5433:5432"  # Cambiar puerto externo
```

### PostgreSQL no responde

```bash
# Reiniciar contenedor
docker compose restart postgres

# O eliminar y recrear
docker compose down
docker volume rm notes_postgres_data
docker compose up -d
```

### Prisma client outdated

```bash
docker compose exec backend npx prisma generate
```

## Despliegue en Producción

### Requisitos

1. Base de datos PostgreSQL (Render)
2. Hosting Node.js (Render)
3. JWT_SECRET fuerte y aleatorio

### Configuración

```bash
# Variables de entorno en producción
DATABASE_URL=postgresql://...
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=24h
NODE_ENV=production
PORT=3000
```

### Build y Deploy

```bash
npm run build
npm run start:prod
```

## Documentación Adicional

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [JWT.io](https://jwt.io)

## Licencia

UNLICENSED

## Autor

Sistema de gestión de notas - Proyecto Backend

---

**Última actualización**: Noviembre 2025

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
