@echo off
echo.
echo ========================================
echo   Building and Starting SUVIGYA Website
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Step 1: Building the website...
echo.
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Starting local server...
echo.
echo Opening browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server and open browser
timeout /t 2 /nobreak >nul
start http://localhost:3000
node serve.js

pause
