# 📋 Guía Paso a Paso: Configurar Google Drive API

## 🎯 **Pasos Rápidos (5 minutos)**

### **1. 🔗 Abrir Google Cloud Console**
- Ve a: https://console.cloud.google.com/
- Inicia sesión con tu cuenta de Google

### **2. 🆕 Crear Proyecto**
```
1. Clic en "Seleccionar proyecto" (arriba)
2. Clic en "NUEVO PROYECTO"
3. Nombre: "CineStream" 
4. Clic en "CREAR"
5. Esperar que se cree el proyecto
```

### **3. 🔌 Habilitar Google Drive API**
```
1. En el menú lateral: "APIs y servicios" > "Biblioteca"
2. Buscar: "Google Drive API"
3. Clic en el resultado
4. Clic en "HABILITAR"
5. Esperar confirmación
```

### **4. 🔑 Crear API Key**
```
1. Menú lateral: "APIs y servicios" > "Credenciales"
2. Clic en "+ CREAR CREDENCIALES"
3. Seleccionar "Clave de API"
4. COPIAR la clave que aparece
5. (Opcional) Clic en "RESTRINGIR CLAVE" para mayor seguridad
```

### **5. 📁 Preparar tu carpeta de Google Drive**
```
1. Ve a https://drive.google.com/
2. Crear una carpeta llamada "Películas"
3. Clic derecho en la carpeta > "Compartir"
4. Cambiar a "Cualquier persona con el enlace"
5. Copiar el ID de la carpeta (parte entre /folders/ y ?usp)
   Ejemplo: https://drive.google.com/drive/folders/1ABC123DEF456GHI789
   El ID es: 1ABC123DEF456GHI789
```

### **6. ⚙️ Configurar tu aplicación**

Actualiza tu archivo `.env.local` con estos valores:

```env
# Google Drive API Configuration
GOOGLE_DRIVE_API_KEY=AIzaSy...tu_api_key_real_aqui
GOOGLE_DRIVE_FOLDER_ID=1ABC123DEF456GHI789
USE_GOOGLE_DRIVE=true
```

### **7. 🎬 Subir películas**
```
1. Ve a tu carpeta "Películas" en Google Drive
2. Arrastra y suelta archivos de video (.mp4, .mkv, .avi)
3. Nombra los archivos como: "Título de la Película (2022).mp4"
```

### **8. 🚀 Probar tu aplicación**
```
1. Reinicia tu servidor: npm run dev
2. Ve a http://localhost:3000
3. Debe mostrar tus películas de Google Drive
```

---

## 🎨 **Ejemplo de estructura de archivos en Google Drive:**

```
📁 Películas/
├── 🎬 Avatar The Way of Water (2022).mp4
├── 🎬 Top Gun Maverick (2022).mp4  
├── 🎬 Spider-Man No Way Home (2021).mp4
└── 🎬 Black Panther Wakanda Forever (2022).mp4
```

---

## ✅ **Verificar que funciona:**

1. **En los logs del servidor debe aparecer:**
   ```
   Using Google Drive as movie source...
   Found X movies in Google Drive
   ```

2. **En la API debe responder:**
   ```json
   {
     "success": true,
     "source": "google_drive",
     "movies": [...tus películas...]
   }
   ```

3. **En tu navegador:**
   - Ve a http://localhost:3000/api/movies
   - Debe mostrar tus películas de Google Drive

---

## 🔧 **Solución de problemas:**

### ❌ **Error: "API Key inválida"**
- Verifica que copiaste la API Key completa
- Asegúrate de que Google Drive API está habilitada

### ❌ **Error: "Folder not found"**
- Verifica que el FOLDER_ID es correcto
- Asegúrate de que la carpeta es pública

### ❌ **No aparecen películas**
- Verifica que los archivos son videos (.mp4, .mkv, .avi)
- Revisa que están en la carpeta correcta

---

## 🎉 **¡Listo!**

Tu aplicación ahora puede usar Google Drive como fuente de películas. Es mucho más fácil que Terabox y no tiene restricciones de F12.
