# 📡 Integración con Terabox API

Esta guía te ayudará a conectar tu aplicación CineStream con la API de Terabox para obtener y transmitir películas desde tu cuenta.

## 🔑 Configuración de API

### 1. Obtener Credenciales de Terabox

1. **Accede a tu cuenta de Terabox Developer**
2. **Crea una nueva aplicación**
3. **Obtén tus credenciales**:
   - API Key
   - Access Token
   - Refresh Token

### 2. Configurar Variables de Entorno

Actualiza tu archivo `.env.local`:

```env
# Terabox API Configuration
TERABOX_API_KEY=tu_api_key_aqui
TERABOX_ACCESS_TOKEN=tu_access_token_aqui
TERABOX_REFRESH_TOKEN=tu_refresh_token_aqui
TERABOX_BASE_URL=https://api.terabox.com/v1
```

## 🔧 Implementación

### 1. Actualizar API de Películas

Modifica `/src/app/api/movies/route.js`:

```javascript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Llamada real a Terabox API
    const response = await fetch(`${process.env.TERABOX_BASE_URL}/files`, {
      headers: {
        'Authorization': `Bearer ${process.env.TERABOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      params: {
        path: '/Movies', // Carpeta de películas en Terabox
        type: 'video'
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching from Terabox');
    }

    const data = await response.json();
    
    // Transformar datos de Terabox al formato de la app
    const movies = data.files
      .filter(file => isVideoFile(file.name))
      .map(file => ({
        id: file.fs_id,
        title: extractTitle(file.server_filename),
        poster: file.thumbs?.url_3 || '/api/placeholder/300/450',
        genre: detectGenre(file.server_filename),
        year: extractYear(file.server_filename),
        rating: Math.random() * (10 - 6) + 6, // Placeholder
        description: `Película: ${extractTitle(file.server_filename)}`,
        videoUrl: file.dlink,
        duration: formatDuration(file.duration),
        size: formatFileSize(file.size)
      }));

    return NextResponse.json({
      success: true,
      movies,
      total: movies.length
    });

  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Funciones auxiliares
function isVideoFile(filename) {
  const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm'];
  return videoExtensions.some(ext => 
    filename.toLowerCase().endsWith(ext)
  );
}

function extractTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, '') // Quitar extensión
    .replace(/[\[\(].*?[\]\)]/g, '') // Quitar texto entre [] o ()
    .replace(/\d{4}/g, '') // Quitar años
    .trim();
}

function detectGenre(filename) {
  const genres = {
    'action': ['action', 'fighting', 'war', 'combat'],
    'comedy': ['comedy', 'funny', 'humor'],
    'drama': ['drama', 'romantic', 'love'],
    'horror': ['horror', 'scary', 'terror'],
    'scifi': ['sci-fi', 'science', 'future', 'space']
  };

  const lowerName = filename.toLowerCase();
  
  for (const [genre, keywords] of Object.entries(genres)) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return genre.charAt(0).toUpperCase() + genre.slice(1);
    }
  }
  
  return 'Acción'; // Género por defecto
}

function extractYear(filename) {
  const yearMatch = filename.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? parseInt(yearMatch[0]) : 2023;
}

function formatDuration(seconds) {
  if (!seconds) return 'N/A';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}min`;
}

function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}
```

### 2. Actualizar API de Streaming

Modifica `/src/app/api/stream/[movieId]/route.js`:

```javascript
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { movieId } = params;
  
  try {
    // Obtener enlace de descarga directo de Terabox
    const response = await fetch(
      `${process.env.TERABOX_BASE_URL}/file/download`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TERABOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fs_id: movieId
        })
      }
    );

    if (!response.ok) {
      throw new Error('Error getting download link from Terabox');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      streamUrl: data.dlink,
      movieId: movieId,
      expires: data.expire,
      quality: ['720p', '1080p'], // Según disponibilidad
      subtitles: []
    });

  } catch (error) {
    console.error('Error getting stream URL:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

## 🔄 Manejo de Tokens

### Renovación Automática de Tokens

Crea un helper para manejar tokens expirados:

```javascript
// utils/teraboxAuth.js
export async function refreshTeraboxToken() {
  try {
    const response = await fetch('https://api.terabox.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: process.env.TERABOX_REFRESH_TOKEN,
        client_id: process.env.TERABOX_API_KEY
      })
    });

    const data = await response.json();
    
    if (data.access_token) {
      // Aquí deberías guardar el nuevo token
      // En producción, usa una base de datos
      process.env.TERABOX_ACCESS_TOKEN = data.access_token;
      return data.access_token;
    }
    
    throw new Error('Failed to refresh token');
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

export async function makeTeraboxRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${process.env.TERABOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expirado, renovar
      await refreshTeraboxToken();
      
      // Reintentar la petición
      return fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${process.env.TERABOX_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
    }

    return response;
  } catch (error) {
    console.error('Error making Terabox request:', error);
    throw error;
  }
}
```

## 📁 Estructura de Carpetas Recomendada en Terabox

Organiza tus películas en Terabox de la siguiente manera:

```
/Movies/
├── Action/
│   ├── Movie.Title.2023.1080p.mp4
│   └── Another.Action.Movie.2022.720p.mkv
├── Comedy/
│   ├── Funny.Movie.2023.mp4
│   └── Comedy.Film.2022.avi
├── Drama/
└── Horror/
```

## 🎯 Consejos de Optimización

### 1. Cache de Metadatos
- Guarda información de películas en base de datos local
- Actualiza solo cuando sea necesario
- Usa Redis para cache rápido

### 2. Streaming Optimizado
- Implementa streaming adaptativo
- Usa CDN para mejor rendimiento
- Considera compresión de video

### 3. Manejo de Errores
- Implementa reintentos automáticos
- Maneja límites de API
- Logs detallados para debugging

## 🚨 Limitaciones y Consideraciones

1. **Límites de API**: Respeta los límites de Terabox
2. **Tamaño de archivos**: Videos grandes pueden tardar en cargar
3. **Ancho de banda**: Considera el costo de transferencia
4. **Legalidad**: Asegúrate de tener derechos sobre el contenido

## 🔐 Seguridad

- Nunca expongas tokens en el frontend
- Usa variables de entorno para credenciales
- Implementa autenticación de usuarios
- Considera encriptación para tokens sensibles

## 📞 Soporte

Si tienes problemas con la integración:

1. Verifica tus credenciales de API
2. Revisa los logs del servidor
3. Consulta la documentación oficial de Terabox
4. Prueba con archivos pequeños primero
