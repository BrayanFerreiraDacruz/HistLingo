#!/bin/bash
# Verificação de pré-requisitos para executar HistLingo

echo "================================"
echo "HistLingo - Verificação de Setup"
echo "================================"
echo ""

# Verificar Java
echo "Verificando Java..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | grep -oE '[0-9]+' | head -1)
    echo "✓ Java $JAVA_VERSION instalado"
else
    echo "✗ Java não encontrado. Instale Java 17+"
    exit 1
fi

# Verificar Maven
echo ""
echo "Verificando Maven..."
if command -v mvn &> /dev/null; then
    echo "✓ Maven instalado"
else
    echo "✗ Maven não encontrado. Instale Maven 3.8.0+"
    exit 1
fi

# Verificar PostgreSQL
echo ""
echo "Verificando PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL instalado"
else
    echo "⚠ PostgreSQL não encontrado. Será necessário para executar a app"
    echo "  Alternativa: Use 'docker-compose up' para rodar com Docker"
fi

# Verificar Git
echo ""
echo "Verificando Git..."
if command -v git &> /dev/null; then
    echo "✓ Git instalado"
else
    echo "⚠ Git não encontrado"
fi

# Verificar Docker (opcional)
echo ""
echo "Verificando Docker (opcional)..."
if command -v docker &> /dev/null; then
    echo "✓ Docker instalado"
    if command -v docker-compose &> /dev/null; then
        echo "✓ Docker Compose instalado"
    else
        echo "⚠ Docker Compose não encontrado"
    fi
else
    echo "⚠ Docker não instalado (opcional para desenvolvimento)"
fi

echo ""
echo "================================"
echo "✓ Verificação concluída!"
echo "================================"
echo ""
echo "Próximos passos:"
echo "1. Editar src/main/resources/application.properties com suas credenciais"
echo "2. Executar: mvn spring-boot:run"
echo "3. Ou abrir em IntelliJ IDEA e clicar em Run"
echo ""

