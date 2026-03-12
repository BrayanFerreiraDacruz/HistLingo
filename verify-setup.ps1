# Verificação de pré-requisitos para executar HistLingo

Write-Host "================================" -ForegroundColor Cyan
Write-Host "HistLingo - Verificação de Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Java
Write-Host "Verificando Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    if ($javaVersion) {
        Write-Host "✓ Java instalado" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Java não encontrado. Instale Java 17+" -ForegroundColor Red
    exit 1
}

# Verificar Maven
Write-Host ""
Write-Host "Verificando Maven..." -ForegroundColor Yellow
try {
    $mvnVersion = mvn -v 2>&1
    if ($mvnVersion) {
        Write-Host "✓ Maven instalado" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Maven não encontrado. Instale Maven 3.8.0+" -ForegroundColor Red
    exit 1
}

# Verificar PostgreSQL
Write-Host ""
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
try {
    $psqlVersion = psql --version 2>&1
    if ($psqlVersion) {
        Write-Host "✓ PostgreSQL instalado" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ PostgreSQL não encontrado. Será necessário para executar a app" -ForegroundColor Yellow
    Write-Host "  Alternativa: Use 'docker-compose up' para rodar com Docker"
}

# Verificar Git
Write-Host ""
Write-Host "Verificando Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    if ($gitVersion) {
        Write-Host "✓ Git instalado" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Git não encontrado" -ForegroundColor Yellow
}

# Verificar Docker (opcional)
Write-Host ""
Write-Host "Verificando Docker (opcional)..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    if ($dockerVersion) {
        Write-Host "✓ Docker instalado" -ForegroundColor Green
        try {
            $composeVersion = docker-compose --version 2>&1
            Write-Host "✓ Docker Compose instalado" -ForegroundColor Green
        } catch {
            Write-Host "⚠ Docker Compose não encontrado" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠ Docker não instalado (opcional para desenvolvimento)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✓ Verificação concluída!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Editar src/main/resources/application.properties com suas credenciais"
Write-Host "2. Executar: mvn spring-boot:run"
Write-Host "3. Ou abrir em IntelliJ IDEA e clicar em Run"
Write-Host ""

