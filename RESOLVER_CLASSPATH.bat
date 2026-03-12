@echo off
REM Script para resolver problema de classpath do IntelliJ

echo.
echo ========================================
echo Resolvendo problema de classpath
echo ========================================
echo.

echo 1. Compilando com Maven...
cd C:\Users\user\IdeaProjects\HistLingo
set JAVA_HOME=C:\Users\user\.jdks\openjdk-25.0.2
"C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.3\plugins\maven\lib\maven3\bin\mvn.cmd" clean compile -q

echo 2. Cache do IntelliJ foi removido
echo 3. Arquivos de configuracao foram criados

echo.
echo IMPORTANTE: Feche o IntelliJ completamente
echo Depois abra o projeto novamente
echo.
echo O IntelliJ va reindexar o projeto automaticamente
echo Após terminar, clique em:
echo   Run > Run HistlimgoApplication (Shift+F10)
echo.

pause

