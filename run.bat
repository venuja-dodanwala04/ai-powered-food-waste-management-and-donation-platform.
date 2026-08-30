@echo off
REM ============================================================================
REM  EcoKitchen AI  -  one-click launcher  (Windows)
REM
REM  Double-click this file. On the first run it will:
REM    1. verify Python and Node.js are installed
REM    2. create food_waste_management_backend\.env (and a random JWT secret),
REM       then pause so you can set MONGODB_URL to your local Mongo instance
REM    3. create the Python virtual environment and install backend packages
REM    4. run "npm install" for the frontend
REM  On every run it starts the backend (127.0.0.1:8000) and the frontend
REM  (localhost:5173) in two separate windows and opens the browser.
REM
REM  To stop the app: close the "EcoKitchen API" and "EcoKitchen Web" windows.
REM ============================================================================

setlocal enableextensions
cd /d "%~dp0"

set "ROOT=%~dp0"
set "BACKEND=%ROOT%food_waste_management_backend"
set "FRONTEND=%ROOT%food_waste_management_frontend"

echo.
echo  ===========================================================
echo    EcoKitchen AI  -  one-click launcher
echo  ===========================================================
echo.

REM ---------- 1. prerequisites -------------------------------------------------
set "PY="
where py >nul 2>&1 && set "PY=py -3"
if not defined PY ( where python >nul 2>&1 && set "PY=python" )
if not defined PY (
  echo [ERROR] Python not found on PATH.  Install Python 3.11+ :  https://www.python.org/downloads/
  echo         ^(tick "Add python.exe to PATH" in the installer^)
  pause & exit /b 1
)
where node >nul 2>&1 || ( echo [ERROR] Node.js not found.  Install Node 20+ :  https://nodejs.org/ & pause & exit /b 1 )
where npm  >nul 2>&1 || ( echo [ERROR] npm not found ^(it ships with Node.js^). & pause & exit /b 1 )
echo [ok] Python and Node.js found.

REM ---------- 2. backend .env ------------------------------------------------
if not exist "%BACKEND%\.env" (
  copy /y "%BACKEND%\.env.example" "%BACKEND%\.env" >nul
  powershell -NoProfile -Command "$s=[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 })); (Get-Content -Raw '%BACKEND%\.env') -replace 'JWT_SECRET_KEY=.*', ('JWT_SECRET_KEY=' + $s) | Set-Content -NoNewline '%BACKEND%\.env'"
  echo.
  echo   -----------------------------------------------------------
  echo    Created  food_waste_management_backend\.env
  echo    - A random JWT_SECRET_KEY has been generated for you.
  echo.
  echo    - MONGODB_URL is currently  mongodb://localhost:27017
  echo      If your local MongoDB uses a different host/port/creds,
  echo      open that .env file now, set MONGODB_URL, and save it.
  echo   -----------------------------------------------------------
  echo.
  pause
) else (
  echo [ok] Backend .env present.
)

REM ---------- 3. backend virtual env + packages ----------------------------
if not exist "%BACKEND%\.venv\.deps-installed" (
  if not exist "%BACKEND%\.venv\Scripts\python.exe" (
    echo [setup] Creating Python virtual environment ...
    %PY% -m venv "%BACKEND%\.venv" || ( echo [ERROR] Could not create the virtual environment. & pause & exit /b 1 )
  )
  echo [setup] Installing backend packages ^(first run only - can take several minutes^) ...
  "%BACKEND%\.venv\Scripts\python.exe" -m pip install --upgrade pip
  "%BACKEND%\.venv\Scripts\python.exe" -m pip install -r "%BACKEND%\requirements.txt" || ( echo [ERROR] pip install failed - see the messages above. & pause & exit /b 1 )
  > "%BACKEND%\.venv\.deps-installed" echo installed %date% %time%
) else (
  echo [ok] Backend packages already installed.
)

REM ---------- 4. frontend packages --------------------------------------------
if not exist "%FRONTEND%\node_modules" (
  echo [setup] Installing frontend packages ^(first run only - can take several minutes^) ...
  pushd "%FRONTEND%"
  call npm install || ( echo [ERROR] npm install failed. & popd & pause & exit /b 1 )
  popd
) else (
  echo [ok] Frontend packages already installed.
)

REM ---------- 5. launch -----------------------------------------------------
echo.
echo [run] Backend   ->  http://127.0.0.1:8000        ^(API docs: /docs^)
start "EcoKitchen API" /D "%BACKEND%" cmd /k .venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

echo [run] Frontend  ->  http://localhost:5173
start "EcoKitchen Web" /D "%FRONTEND%" cmd /k npm run dev

echo [run] Opening the browser shortly ...
timeout /t 5 /nobreak >nul
start "" http://localhost:5173

echo.
echo  ===========================================================
echo    Running.  Two windows were opened:
echo      * "EcoKitchen API"  - FastAPI / uvicorn  (port 8000)
echo      * "EcoKitchen Web"  - Vite dev server    (port 5173)
echo    Close BOTH windows to stop the application.
echo  ===========================================================
echo.
exit /b 0
