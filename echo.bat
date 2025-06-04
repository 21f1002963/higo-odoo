echo off
echo Deleting old Git history...
rmdir /s /q .git

echo Initializing new Git repo...
git init

echo Adding all files...
git add .

echo Creating new initial commit...
git commit -m "Fresh start - removed all history"

set /p REMOTE_URL="Enter your GitHub repo URL (e.g. https://github.com/username/repo.git): "
git remote add origin %REMOTE_URL%

echo Renaming current branch to main...
git branch -M main

echo Force pushing to GitHub...
git push -f origin main

echo DONE. Your repo is now clean and force-pushed to GitHub.
pause
