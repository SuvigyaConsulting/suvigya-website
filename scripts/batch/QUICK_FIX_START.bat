@echo off
echo.
echo ========================================
echo   Rebuilding and Starting Website
echo ========================================
echo.
echo This will rebuild with the new plant growth animation...
echo.

REM Build the project
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo Build complete! Starting server...
echo.
echo Opening browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server and open browser
timeout /t 1 /nobreak >nul
start http://localhost:3000
node serve.js

pause
