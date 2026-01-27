@echo off
echo.
echo ========================================
echo   SUVIGYA CONSULTING - Website Launcher
echo ========================================
echo.

REM Check if out directory exists
if not exist "out" (
    echo [ERROR] Build directory 'out' not found!
    echo.
    echo Please run: npm run build
    echo.
    pause
    exit /b 1
)

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

echo Starting local server...
echo.
echo Opening browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server and open browser
start http://localhost:3000
node serve.js

pause
