Param(
  [string]$VenvPath = "venv"
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$venvFile = Join-Path $root "..\$VenvPath"

if (-not (Test-Path $venvFile)) {
  Write-Host "Archivo de entorno '$venvFile' no encontrado. Ejecutando expo sin cargar venv." -ForegroundColor Yellow
  npx expo start --clear
  exit $LASTEXITCODE
}

Get-Content $venvFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -eq '' -or $line.StartsWith('#')) { return }
  $parts = $line -split '=', 2
  if ($parts.Length -ge 2) {
    $name = $parts[0].Trim()
    $value = $parts[1].Trim()
    # Quitar comillas alrededor si existen
    if ($value.StartsWith('"') -and $value.EndsWith('"')) { $value = $value.Trim('"') }
    if ($value.StartsWith("'") -and $value.EndsWith("'")) { $value = $value.Trim("'") }
    # Asignar la variable de entorno para el proceso actual de forma robusta
    try {
      Set-Item -Path "Env:$name" -Value $value -ErrorAction Stop
    } catch {
      # Fallback seguro usando API .NET si Set-Item falla
      [System.Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
  }
}

Write-Host "Variables cargadas desde $venvFile" -ForegroundColor Green
npx expo start --clear
