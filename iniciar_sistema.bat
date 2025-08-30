@echo off
:: Moverse a la carpeta backend
cd /d C:\Users\gerop\Proyectos\sistemaControl-Asteras\backend-asteras
echo Iniciando servidor backend...
start cmd /k "npm run dev"

:: Moverse a la carpeta frontend
cd /d C:\Users\gerop\Proyectos\sistemaControl-Asteras\frontend-asteras
echo Iniciando servidor frontend...
start cmd /k "npm run dev"

:: Mensaje final
echo Todo iniciado. Puedes cerrar esta ventana.
pause
