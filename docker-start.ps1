# Script para iniciar la aplicación Notes API con Docker en Windows

Write-Host "=================================="
Write-Host "🚀 Notes API - Docker Startup" -ForegroundColor Green
Write-Host "=================================="
Write-Host ""

# Verificar si Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Docker detectado" -ForegroundColor Yellow

# Verificar si Docker Compose está disponible
try {
    docker compose version | Out-Null
    Write-Host "✓ Docker Compose detectado" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Docker Compose no está disponible" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Crear .env si no existe
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creando archivo .env" -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env creado" -ForegroundColor Green
} else {
    Write-Host "✓ .env ya existe" -ForegroundColor Yellow
}

Write-Host ""

# Levantar los contenedores
Write-Host "🐳 Levantando contenedores Docker..." -ForegroundColor Yellow
docker compose down 2>$null
docker compose up -d

Write-Host "✓ Contenedores levantados" -ForegroundColor Green
Write-Host ""

# Esperar a que PostgreSQL esté listo
Write-Host "⏳ Esperando a PostgreSQL..." -ForegroundColor Yellow
$counter = 0
$maxAttempts = 30

while ($counter -lt $maxAttempts) {
    try {
        docker compose exec -T postgres pg_isready -U postgres 2>$null | Out-Null
        Write-Host "✓ PostgreSQL está listo" -ForegroundColor Green
        break
    } catch {
        Write-Host -NoNewline "."
        Start-Sleep -Seconds 1
        $counter++
    }
}

Write-Host ""

# Ejecutar migraciones de Prisma
Write-Host "🗄️  Ejecutando migraciones de Prisma..." -ForegroundColor Yellow
docker compose exec backend npx prisma migrate deploy 2>$null
Write-Host "✓ Migraciones completadas" -ForegroundColor Green
Write-Host ""

# Mostrar información de acceso
Write-Host "==================================" -ForegroundColor Green
Write-Host "✅ La aplicación está lista!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Información de Acceso:"
Write-Host "  - API: http://localhost:3000"
Write-Host "  - PostgreSQL: localhost:5432"
Write-Host ""
Write-Host "📚 Documentación:"
Write-Host "  - Guía de Pruebas: TESTING_GUIDE.md"
Write-Host "  - Colección Postman: Postman_Collection.json"
Write-Host ""
Write-Host "🔍 Para ver logs:"
Write-Host "  - Backend: docker compose logs backend -f"
Write-Host "  - PostgreSQL: docker compose logs postgres -f"
Write-Host ""
Write-Host "🛑 Para detener la aplicación:"
Write-Host "  - docker compose down"
Write-Host ""
