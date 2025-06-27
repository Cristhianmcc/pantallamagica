# 🎬 Alternativa Fácil: Usar Google Drive en lugar de Terabox

## 🚫 **Problema con Terabox:**
- Bloquea herramientas de desarrollador (F12)
- API compleja de obtener
- Requiere verificación en China

## ✅ **Solución: Google Drive (MÁS FÁCIL)**

### **Paso 1: Subir películas a Google Drive**
1. Ve a [drive.google.com](https://drive.google.com)
2. Crea una carpeta "Películas"
3. Sube tus archivos de video (.mp4, .mkv, etc.)

### **Paso 2: Hacer enlaces públicos**
1. Clic derecho en cada película
2. "Obtener enlace" → "Cualquier persona con el enlace"
3. Copia el ID del archivo (parte entre `/d/` y `/view`)

### **Paso 3: Configurar en tu app**
Agrega esto a tu `.env.local`:
```env
# Google Drive en lugar de Terabox
USE_GOOGLE_DRIVE=true
GOOGLE_DRIVE_API_KEY=tu_api_key_de_google

# Lista de películas en Google Drive (ID de archivo)
MOVIE_IDS=1abc123def456,2ghi789jkl012,3mno345pqr678
```

### **Paso 4: Obtener API Key de Google (GRATIS)**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo
3. Habilita "Google Drive API"
4. Crear credenciales → API Key
5. Copia la API Key

---

## 🔧 **Modificar tu aplicación para Google Drive**

Voy a crear un archivo que use Google Drive:
