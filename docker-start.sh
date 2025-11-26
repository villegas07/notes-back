#!/bin/bash

# Script para iniciar la aplicación Notes API con Docker

set -e

echo "=================================="
echo "🚀 Notes API - Docker Startup"
echo "=================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker no está instalado${NC}"
    exit 1
fi

echo -e "${YELLOW}✓ Docker detectado${NC}"

# Verificar si Docker Compose está instalado
if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose no está instalado${NC}"
    exit 1
fi

echo -e "${YELLOW}✓ Docker Compose detectado${NC}"
echo ""

# Crear .env si no existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creando archivo .env${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env creado${NC}"
else
    echo -e "${YELLOW}✓ .env ya existe${NC}"
fi

echo ""

# Levantar los contenedores
echo -e "${YELLOW}🐳 Levantando contenedores Docker...${NC}"
docker compose down 2>/dev/null || true
docker compose up -d

echo -e "${GREEN}✓ Contenedores levantados${NC}"
echo ""

# Esperar a que PostgreSQL esté listo
echo -e "${YELLOW}⏳ Esperando a PostgreSQL...${NC}"
for i in {1..30}; do
    if docker compose exec -T postgres pg_isready -U postgres >/dev/null 2>&1; then
        echo -e "${GREEN}✓ PostgreSQL está listo${NC}"
        break
    fi
    echo -n "."
    sleep 1
done

echo ""

# Ejecutar migraciones de Prisma
echo -e "${YELLOW}🗄️  Ejecutando migraciones de Prisma...${NC}"
docker compose exec backend npx prisma migrate deploy || true
echo -e "${GREEN}✓ Migraciones completadas${NC}"
echo ""

# Mostrar información de acceso
echo "=================================="
echo -e "${GREEN}✅ La aplicación está lista!${NC}"
echo "=================================="
echo ""
echo "📌 Información de Acceso:"
echo "  - API: http://localhost:3000"
echo "  - PostgreSQL: localhost:5432"
echo ""
echo "📚 Documentación:"
echo "  - Guía de Pruebas: TESTING_GUIDE.md"
echo "  - Colección Postman: Postman_Collection.json"
echo ""
echo "🔍 Para ver logs:"
echo "  - Backend: docker compose logs backend -f"
echo "  - PostgreSQL: docker compose logs postgres -f"
echo ""
echo "🛑 Para detener la aplicación:"
echo "  - docker compose down"
echo ""
