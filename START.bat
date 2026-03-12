@echo off
REM Script para rodar HistLingo

setlocal enabledelayedexpansion

set "JAVA_HOME=C:\Users\user\.jdks\openjdk-25.0.2"
set "MAVEN_HOME=C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.3\plugins\maven\lib\maven3"
set "PATH=%MAVEN_HOME%\bin;%JAVA_HOME%\bin;%PATH%"

cd C:\Users\user\IdeaProjects\HistLingo

echo.
echo ========================================
echo HistLingo - Compilando e Iniciando
echo ========================================
echo.

echo [1/3] Compilando...
call mvn.cmd clean compile -DskipTests -q

if %ERRORLEVEL% neq 0 (
    echo [ERRO] Falha na compilacao
    pause
    exit /b 1
)

echo [2/3] Compilacao concluida!
echo.
echo [3/3] Iniciando aplicacao...
echo.
echo Aguarde a mensagem: "Tomcat started on port(s): 8082"
echo.
echo Depois abra no navegador:
echo http://localhost:8082/swagger-ui.html
echo.
echo ========================================
echo.

call mvn.cmd spring-boot:run

pause

