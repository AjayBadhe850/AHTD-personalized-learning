@echo off
REM AI Learning Platform v2.0 Setup Script for Windows

echo 🚀 Setting up AI Learning Platform v2.0...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is required but not installed.
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed.
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup Backend
echo 🔧 Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt

echo ✅ Backend setup complete

REM Setup Frontend
echo 🎨 Setting up frontend...
cd ..\frontend

REM Install dependencies
npm install

echo ✅ Frontend setup complete

echo.
echo 🎉 Setup complete! To run the application:
echo.
echo Backend:
echo   cd backend
echo   venv\Scripts\activate.bat
echo   uvicorn app.main:app --reload
echo.
echo Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Or use Docker (if installed):
echo   docker-compose up -d
echo.
echo Access the application at:
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8000
echo   API Docs: http://localhost:8000/docs

pause
