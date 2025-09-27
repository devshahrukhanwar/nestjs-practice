# Docker Setup for NestJS with PostgreSQL

This project is configured to run in Docker containers with VS Code development containers support.

## Quick Start

### Prerequisites

- Docker and Docker Compose installed
- VS Code with the "Dev Containers" extension

### Using VS Code Dev Containers (Recommended)

1. Open the project in VS Code
2. When prompted, click "Reopen in Container" or use Command Palette → "Dev Containers: Reopen in Container"
3. VS Code will build and start all containers automatically
4. Your development environment is ready!

### Manual Docker Setup

1. **Clone and navigate to the project:**

   ```bash
   cd nest-learning
   ```

2. **Start the services:**

   ```bash
   docker-compose up -d
   ```

3. **Install dependencies (if not using dev containers):**

   ```bash
   docker-compose exec nestjs-app npm install
   ```

4. **Access the application:**
   - NestJS App: http://localhost:3000
   - pgAdmin: http://localhost:8080
   - PostgreSQL: localhost:5432

## Services

### NestJS Application

- **Container:** `nestjs-learning-app`
- **Port:** 3000
- **Features:** Hot reload, TypeScript support, debugging

### PostgreSQL Database

- **Container:** `nestjs-postgres-db`
- **Port:** 5432
- **Database:** `nestjs_learning`
- **User:** `nestjs` / **Password:** `nestjs123`

### pgAdmin

- **Container:** `nestjs-pgadmin`
- **Port:** 8080
- **Access:** http://localhost:8080
- **Login:** `admin@example.com` / `admin123`

## Required NestJS Packages for PostgreSQL

To connect your NestJS application to PostgreSQL, install these packages:

```bash
# Core database packages
npm install @nestjs/typeorm typeorm pg

# Configuration management
npm install @nestjs/config

# Validation (recommended)
npm install class-validator class-transformer

# For production (optional)
npm install @nestjs/swagger swagger-ui-express
```

### Development packages:

```bash
npm install --save-dev @types/node @types/pg
```

## Database Configuration

1. **Update your `app.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'nestjs',
      password: process.env.DATABASE_PASSWORD || 'nestjs123',
      database: process.env.DATABASE_NAME || 'nestjs_learning',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
    }),
    // ... your other modules
  ],
})
export class AppModule {}
```

2. **Create an entity (example `user.entity.ts`):**

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'first_name', nullable: true })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

## Environment Variables

The project uses these environment variables (see `.env` file):

- `DATABASE_HOST`: PostgreSQL host (default: postgres-db)
- `DATABASE_PORT`: PostgreSQL port (default: 5432)
- `DATABASE_USER`: Database user (default: nestjs)
- `DATABASE_PASSWORD`: Database password (default: nestjs123)
- `DATABASE_NAME`: Database name (default: nestjs_learning)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Application port (default: 3000)

## Development Commands

```bash
# Start development server with hot reload
npm run start:dev

# Build the application
npm run build

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint code
npm run lint

# Format code
npm run format
```

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f nestjs-app

# Access application container
docker-compose exec nestjs-app bash

# Access MySQL container
docker-compose exec mysql-db mysql -u nestjs -p nestjs_learning

# Rebuild containers
docker-compose build --no-cache
```

## Database Management

### Using pgAdmin

1. Open http://localhost:8080
2. Login with:
   - **Email:** `admin@example.com`
   - **Password:** `admin123`
3. Add a new server connection:
   - **Host:** `postgres-db`
   - **Port:** `5432`
   - **Username:** `nestjs`
   - **Password:** `nestjs123`
   - **Database:** `nestjs_learning`

### Using PostgreSQL CLI

```bash
# Connect to database
docker-compose exec postgres-db psql -U nestjs -d nestjs_learning

# Or connect as postgres user
docker-compose exec postgres-db psql -U postgres
```

## Troubleshooting

### Common Issues:

1. **Port conflicts:** Change ports in `docker-compose.yml` if needed
2. **Permission issues:** Ensure Docker has access to the project directory
3. **Database connection:** Check if PostgreSQL container is healthy: `docker-compose ps`
4. **Hot reload not working:** Ensure volume mounts are correct

### Reset Database:

```bash
docker-compose down -v
docker-compose up -d
```

### Clean Rebuild:

```bash
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

## VS Code Extensions Included

The dev container automatically installs these extensions:

- TypeScript support
- ESLint and Prettier
- Docker support
- MySQL support
- Auto-rename tags
- Path IntelliSense
- And more...

## File Structure

```
nest-learning/
├── .devcontainer/          # VS Code dev container configuration
├── docker/                 # Docker-related files
│   └── postgres/
│       └── init/           # Database initialization scripts
├── src/                    # NestJS source code
├── Dockerfile              # Docker image definition
├── docker-compose.yml      # Multi-container setup
├── .env                    # Environment variables
└── .env.example           # Environment template
```
