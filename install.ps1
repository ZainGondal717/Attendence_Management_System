# PowerShell Installation Script for Windows
# Run this script to set up the entire project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Blockchain Attendance Management System" -ForegroundColor Cyan
Write-Host "Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✓ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 1: Installing backend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend installation failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the backend server:" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. In a new terminal, start the frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Yellow
Write-Host "   npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. (Optional) Seed sample data:" -ForegroundColor White
Write-Host "   npm run seed" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. (Optional) Run interactive demo:" -ForegroundColor White
Write-Host "   node backend/demo.js" -ForegroundColor Yellow
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor White
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "For more information, see:" -ForegroundColor White
Write-Host "  - README.md" -ForegroundColor Yellow
Write-Host "  - QUICKSTART.md" -ForegroundColor Yellow
Write-Host "  - SETUP.md" -ForegroundColor Yellow
Write-Host ""
