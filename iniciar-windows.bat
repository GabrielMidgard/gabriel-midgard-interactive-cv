@echo off
title CV interactivo de Gabriel Vazquez Ruiz
where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js.
  echo Instala Node.js 22 o posterior desde https://nodejs.org/
  pause
  exit /b 1
)

echo Preparando el sitio...
call npm install
if errorlevel 1 (
  echo No se pudieron instalar las dependencias.
  pause
  exit /b 1
)

echo.
echo El sitio se abrira normalmente en http://localhost:5173
echo Para detenerlo, presiona Ctrl+C.
call npm run dev
pause
