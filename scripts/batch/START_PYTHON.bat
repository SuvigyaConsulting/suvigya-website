@echo off
echo.
echo ========================================
echo   SUVIGYA - Python Server Launcher
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

REM Check if Python is installed
python --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo.
    echo Please install Python from https://python.org/
    echo Or use START.bat which requires Node.js
    echo.
    pause
    exit /b 1
)

echo Starting Python server...
echo.
echo Opening browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

python serve.py

pause
