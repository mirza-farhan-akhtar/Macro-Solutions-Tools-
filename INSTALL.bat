@echo off
echo ============================================
echo MACRO Solutions - PHP ^& Composer Installer
echo ============================================
echo.
echo This will install PHP and Composer automatically
echo.
echo Requirements:
echo  - PHP 8.3 ZIP file in Downloads folder
echo  - Run as Administrator
echo.
pause

PowerShell.exe -NoProfile -ExecutionPolicy Bypass -Command "& '%~dp0install-php-composer.ps1'"

echo.
echo ============================================
echo Installation script completed!
echo ============================================
echo.
echo Next: Close this window and open a NEW PowerShell
echo Then run: cd E:\MACRO\backend; composer install
echo.
pause
