// Script para ayudar a obtener tokens de Terabox
// IMPORTANTE: Terabox bloquea F12, usa estos métodos alternativos

console.log(`
� TERABOX BLOQUEA F12 - MÉTODOS ALTERNATIVOS
============================================

⚠️  Terabox detecta y bloquea las herramientas de desarrollador (F12)
💡 Usa estos métodos alternativos:

MÉTODO 1 - Interceptar con extensión del navegador:
1. Instala la extensión "ModHeader" o "Requestly"
2. Configura para interceptar requests a terabox.com
3. Busca headers que contengan tokens

MÉTODO 2 - Usar proxy/interceptor:
1. Instala Fiddler, Charles Proxy o Burp Suite
2. Configura tu navegador para usar el proxy
3. Ve a terabox.com e intercepta las requests
4. Busca URLs con access_token

MÉTODO 3 - Inspeccionar URL después de login:
1. Ve a https://terabox.com e inicia sesión
2. Después del login, copia la URL completa
3. A veces el token aparece en la URL de redirección

MÉTODO 4 - Usar navegador alternativo sin restricciones:
1. Prueba con Firefox en modo privado
2. O usa un navegador menos común como Brave

MÉTODO 5 - API Oficial de Baidu (MÁS CONFIABLE):
1. Ve a https://console.bce.baidu.com/
2. Crea una aplicación de desarrollador
3. Obtén credenciales oficiales

MÉTODO 6 - Usar bibliotecas existentes:
1. npm install terabox-downloader
2. npm install baidu-netdisk-api

============================================
ALTERNATIVAS SIN TERABOX API:
============================================

OPCIÓN A - Google Drive:
1. Sube tus películas a Google Drive
2. Haz los enlaces públicos
3. Usa la API de Google Drive

OPCIÓN B - Usar APIs de películas públicas:
1. TMDB API (themoviedb.org)
2. OMDb API (omdbapi.com)
3. JustWatch API

OPCIÓN C - Tu aplicación YA FUNCIONA:
- Los videos de demostración se reproducen perfectamente
- Solo necesitas Terabox para contenido personal

======================================
`);

// Método alternativo para obtener tokens si F12 está bloqueado
function alternativeTokenExtraction() {
  console.log(`
🔧 MÉTODO ALTERNATIVO JAVASCRIPT:
================================

Si logras ejecutar JavaScript en la página (por ejemplo, pegando en la barra de direcciones),
prueba estos comandos:

1. Buscar en localStorage:
javascript:alert(localStorage.getItem('access_token') || 'No encontrado');

2. Buscar todos los tokens:
javascript:alert(Object.keys(localStorage).filter(k=>k.includes('token')).map(k=>k+':'+localStorage.getItem(k)).join('\\n'));

3. Buscar en sessionStorage:
javascript:alert(sessionStorage.getItem('access_token') || 'No encontrado');

4. Inspeccionar cookies:
javascript:alert(document.cookie);

5. Buscar variables globales:
javascript:alert(JSON.stringify(window.localStorage));

INSTRUCCIONES:
- Copia uno de estos comandos
- Pégalo en la barra de direcciones del navegador
- Presiona Enter
- Se mostrará un alert con la información

======================================
  `);
}

// Función mejorada para cuando F12 está disponible
function extractTokensAdvanced() {
  const tokens = {};
  const sources = [];
  
  try {
    // localStorage
    const localStorageKeys = ['access_token', 'token', 'auth_token', 'user_token', 'baidu_token', 'pan_token'];
    localStorageKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value && value.length > 10) {
        tokens[key] = value;
        sources.push(`localStorage.${key}`);
      }
    });
    
    // sessionStorage
    localStorageKeys.forEach(key => {
      const value = sessionStorage.getItem(key);
      if (value && value.length > 10) {
        tokens[`session_${key}`] = value;
        sources.push(`sessionStorage.${key}`);
      }
    });
    
    // Cookies
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if ((name.includes('token') || name.includes('access') || name.includes('auth')) && value && value.length > 10) {
        tokens[`cookie_${name}`] = value;
        sources.push(`cookie.${name}`);
      }
    });
    
    // Variables globales comunes
    const globalVars = ['ACCESS_TOKEN', 'USER_TOKEN', 'AUTH_TOKEN', 'BAIDU_TOKEN'];
    globalVars.forEach(varName => {
      if (window[varName]) {
        tokens[`global_${varName.toLowerCase()}`] = window[varName];
        sources.push(`window.${varName}`);
      }
    });
    
  } catch (error) {
    console.error('Error extrayendo tokens:', error);
  }
  
  return { tokens, sources };
}

// Mostrar métodos alternativos
alternativeTokenExtraction();

// Solo ejecutar si estamos en terabox.com y F12 funciona
if (window.location.hostname.includes('terabox')) {
  try {
    const { tokens, sources } = extractTokensAdvanced();
    if (Object.keys(tokens).length > 0) {
      console.log('🎉 Tokens encontrados:', tokens);
      console.log('📍 Fuentes:', sources);
      console.log(`
📝 Agrega estos a tu archivo .env.local:
${Object.entries(tokens).map(([key, value]) => `TERABOX_${key.toUpperCase()}=${value}`).join('\n')}
      `);
    } else {
      console.log('❌ No se encontraron tokens automáticamente');
      console.log('💡 Usa los métodos alternativos descritos arriba');
    }
  } catch (error) {
    console.log('🚫 F12 está bloqueado. Usa los métodos alternativos mostrados arriba.');
  }
}
