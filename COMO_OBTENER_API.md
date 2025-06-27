# 🔑 Guía Completa: Cómo Obtener API de Terabox

## 🎯 **Método Recomendado (Más Fácil)**

### **Opción A: Extraer tokens desde el navegador**

1. **Ve a Terabox:**
   - Abre [https://terabox.com](https://terabox.com)
   - Inicia sesión con tu cuenta

2. **Abrir herramientas de desarrollador:**
   - Presiona `F12` o clic derecho > "Inspeccionar"
   - Ve a la pestaña **"Network"** (Red)

3. **Capturar el token:**
   - Recarga la página (`Ctrl + R`)
   - En Network, busca requests que contengan "api" o "terabox"
   - Busca URLs que contengan `access_token=`
   - Copia el valor del token

4. **Alternativa - Desde la consola:**
   ```javascript
   // Pega esto en la consola del navegador en terabox.com
   console.log('Access Token:', localStorage.getItem('access_token'));
   console.log('All tokens:', Object.keys(localStorage).filter(k => k.includes('token')));
   ```

---

## 🏢 **Método Oficial (Más Complejo)**

### **Opción B: API Oficial de Baidu Cloud**

1. **Registro en Baidu Cloud:**
   - Ve a [https://console.bce.baidu.com/](https://console.bce.baidu.com/)
   - Crea una cuenta (puede requerir verificación)

2. **Crear aplicación:**
   - Busca "Personal Cloud Storage API"
   - Crea una nueva aplicación
   - Rellena la información requerida

3. **Obtener credenciales:**
   - **API Key** (App Key)
   - **Secret Key** (App Secret)  
   - **Access Token** (generar via OAuth2)

4. **Generar Access Token:**
   ```bash
   curl -X POST "https://openapi.baidu.com/oauth/2.0/token" \
     -d "grant_type=client_credentials" \
     -d "client_id=TU_API_KEY" \
     -d "client_secret=TU_SECRET_KEY"
   ```

---

## 🔧 **Configuración en tu proyecto**

Una vez tengas los tokens, agrégalos a tu archivo `.env.local`:

```env
# Tokens de Terabox
TERABOX_ACCESS_TOKEN=tu_access_token_aqui
TERABOX_API_KEY=tu_api_key_aqui
TERABOX_CLIENT_ID=tu_client_id_aqui
TERABOX_CLIENT_SECRET=tu_client_secret_aqui
TERABOX_REFRESH_TOKEN=tu_refresh_token_aqui

# Configuración
TERABOX_BASE_URL=https://pan.baidu.com/rest/2.0
```

---

## 🧪 **Alternativas para Desarrollo**

### **Si no puedes obtener la API oficial:**

1. **Usar API de películas públicas:**
   - [The Movie Database (TMDB)](https://www.themoviedb.org/settings/api)
   - [OMDb API](http://www.omdbapi.com/)

2. **Subir videos a servicios alternativos:**
   - Google Drive (con enlaces públicos)
   - YouTube (videos no listados)
   - Vimeo

3. **Bibliotecas no oficiales:**
   ```bash
   npm install terabox-downloader
   npm install pan-baidu-download
   ```

---

## ✅ **Verificar que funciona**

1. **Reinicia tu servidor:**
   ```bash
   npm run dev
   ```

2. **Verifica en los logs:**
   - Sin tokens: "No Terabox credentials found, using sample data"
   - Con tokens: "Fetching movies from Terabox..."

3. **Prueba la API:**
   - Ve a: `http://localhost:3000/api/movies`
   - Debe mostrar `"source": "terabox"` si funciona

---

## 🆘 **Si tienes problemas**

1. **Token inválido:**
   - Verifica que el token no haya expirado
   - Usa el refresh_token para renovarlo

2. **CORS errors:**
   - Los tokens pueden tener restricciones de dominio
   - Prueba desde localhost

3. **Quota limits:**
   - Las APIs tienen límites de uso diario
   - Baidu Cloud puede tener restricciones geográficas

---

## 📞 **Necesitas ayuda?**

Si no puedes obtener los tokens, puedes:
1. Usar los videos de demostración (ya funcionan)
2. Usar una API de películas alternativa
3. Subir algunos videos a Google Drive como prueba

**¡Tu aplicación ya funciona perfectamente con videos de demostración!** Los tokens de Terabox solo agregan contenido real.
