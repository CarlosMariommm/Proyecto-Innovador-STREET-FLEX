<#
  Genera el APK de la app movil (instalable directo en un Android).

  Uso, desde la carpeta movil/:
      powershell -ExecutionPolicy Bypass -File .\scripts\generar-apk.ps1 -ApiUrl "https://TU-API.onrender.com/api"

  -ApiUrl  La direccion publica del backend, con /api al final. Se incrusta en la
           app al construirla (variable EXPO_PUBLIC_API_URL). Si se omite, la app
           apunta a 10.0.2.2:4000 y solo funciona en el emulador de Android.

  Requisitos: Node, JDK 17 y el SDK de Android (el que instala Android Studio).
  Resultado:  movil/apk/StreetFlex.apk

  ── Por que se compila en C:\sfbuild y no aqui ──
  Windows no admite rutas de mas de 260 caracteres, y la compilacion nativa de
  Android (CMake/ninja) las genera larguisimas dentro de node_modules; con el
  proyecto en Documentos\... falla con "Filename longer than 260 characters".
  Por eso el script copia el proyecto a una carpeta corta, compila alli y
  devuelve el APK a movil/apk. Tu carpeta del proyecto no se toca.
#>
param(
  [string]$ApiUrl = "",
  # Arquitecturas que se compilan. arm64-v8a = celulares actuales; x86_64 = emulador.
  [string]$Arquitecturas = "arm64-v8a,x86_64",
  # Carpeta corta donde se compila.
  [string]$CarpetaCorta = (Join-Path $env:SystemDrive "sfbuild")
)

$ErrorActionPreference = "Stop"
$raiz = Split-Path -Parent $PSScriptRoot

if ($ApiUrl) {
  $env:EXPO_PUBLIC_API_URL = $ApiUrl.TrimEnd("/")
  Write-Host "Servidor de la app: $env:EXPO_PUBLIC_API_URL"
} else {
  Remove-Item Env:\EXPO_PUBLIC_API_URL -ErrorAction SilentlyContinue
  Write-Host "AVISO: sin -ApiUrl la app apuntara a 10.0.2.2:4000 (solo sirve en el emulador)." -ForegroundColor Yellow
}

if (-not $env:ANDROID_HOME) {
  $env:ANDROID_HOME = Join-Path $env:LOCALAPPDATA "Android\Sdk"
}
if (-not (Test-Path $env:ANDROID_HOME)) {
  throw "No encuentro el SDK de Android en $env:ANDROID_HOME. Instala Android Studio o define ANDROID_HOME."
}

Write-Host "1/4 Copiando el proyecto a $CarpetaCorta ..."
New-Item -ItemType Directory -Force -Path $CarpetaCorta | Out-Null
# /MIR deja la copia igual al original; las carpetas excluidas (/XD) no se copian
# ni se borran del destino, asi node_modules y android se conservan entre corridas.
robocopy $raiz $CarpetaCorta /MIR /XD node_modules android apk .expo /XF *.apk /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "Fallo la copia del proyecto (robocopy codigo $LASTEXITCODE)." }

Set-Location $CarpetaCorta

# Siempre limpio (npm ci borra node_modules y instala EXACTO lo del package-lock):
# reutilizar uno viejo ya dejo una app que se cerraba al abrir por mezclar dos
# versiones de expo-font.
Write-Host "2/4 Instalando dependencias exactas del package-lock (npm ci)..."
npm ci --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw "Fallo npm ci." }

Write-Host "3/4 Generando el proyecto nativo y compilando el APK (la primera vez tarda varios minutos)..."
npx expo prebuild --platform android --no-install
if ($LASTEXITCODE -ne 0) { throw "Fallo expo prebuild." }

Push-Location android
try {
  .\gradlew.bat assembleRelease "-PreactNativeArchitectures=$Arquitecturas" --no-daemon
  if ($LASTEXITCODE -ne 0) { throw "Fallo la compilacion de Gradle." }
} finally {
  Pop-Location
}

Write-Host "4/4 Copiando el APK a $raiz\apk ..."
$origen = Join-Path $CarpetaCorta "android\app\build\outputs\apk\release\app-release.apk"
$destinoCarpeta = Join-Path $raiz "apk"
New-Item -ItemType Directory -Force -Path $destinoCarpeta | Out-Null
Copy-Item $origen (Join-Path $destinoCarpeta "StreetFlex.apk") -Force

$tam = [math]::Round((Get-Item (Join-Path $destinoCarpeta "StreetFlex.apk")).Length / 1MB, 1)
Write-Host "Listo: $destinoCarpeta\StreetFlex.apk ($tam MB)" -ForegroundColor Green
