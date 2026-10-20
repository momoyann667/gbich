param (
    [string]$Message = "chore: mise à jour automatique"
)

Write-Host "Vérification des modifications..." -ForegroundColor Cyan
git status --short

Write-Host "Indexation de tous les fichiers modifiés..." -ForegroundColor Yellow
git add .

Write-Host "Création du commit : $Message" -ForegroundColor Yellow
git commit -m "$Message"

Write-Host "Envoi vers GitHub (origin/main)..." -ForegroundColor Green
git push origin main

Write-Host "Synchronisation GitHub terminée avec succès !" -ForegroundColor Green
