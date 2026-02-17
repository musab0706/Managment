@echo off
echo ========================================
echo   Pushing your changes to GitHub...
echo ========================================
git add .
set /p msg="Enter a short description of your changes: "
git commit -m "%msg%"
git push origin master
echo.
echo ========================================
echo   Done! Your changes are now on GitHub.
echo ========================================
pause
