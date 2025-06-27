// Utility functions for Terabox API integration

// Constants
const TERABOX_BASE_URL = process.env.TERABOX_BASE_URL || 'https://pan.baidu.com/rest/2.0';

/**
 * Refresh Terabox access token when it expires
 */
export async function refreshTeraboxToken() {
  try {
    const response = await fetch(`${TERABOX_BASE_URL}/oauth/2.0/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: process.env.TERABOX_REFRESH_TOKEN,
        client_id: process.env.TERABOX_API_KEY,
        client_secret: process.env.TERABOX_SECRET_KEY
      })
    });

    const data = await response.json();
    
    if (data.access_token) {
      // En producción, deberías guardar esto en una base de datos
      process.env.TERABOX_ACCESS_TOKEN = data.access_token;
      console.log('Token refreshed successfully');
      return data.access_token;
    }
    
    throw new Error('Failed to refresh token: ' + JSON.stringify(data));
  } catch (error) {
    console.error('Error refreshing Terabox token:', error);
    throw error;
  }
}

/**
 * Make authenticated requests to Terabox API with automatic token refresh
 */
export async function makeTeraboxRequest(endpoint, options = {}) {
  const url = `${TERABOX_BASE_URL}${endpoint}`;
  
  try {
    let response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${process.env.TERABOX_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // If token expired, refresh and retry
    if (response.status === 401) {
      console.log('Token expired, refreshing...');
      await refreshTeraboxToken();
      
      response = await fetch(url, {
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

/**
 * Get files from Terabox directory
 */
export async function getTeraboxFiles(path = '/') {
  try {
    const params = new URLSearchParams({
      access_token: process.env.TERABOX_ACCESS_TOKEN,
      method: 'list',
      dir: path,
      order: 'name',
      desc: '0',
      start: '0',
      limit: '100'
    });

    const response = await fetch(`${TERABOX_BASE_URL}/xpan/file?${params}`);
    const data = await response.json();

    if (data.errno === 0) {
      return data.list;
    } else {
      throw new Error(`Terabox API error: ${data.errmsg}`);
    }
  } catch (error) {
    console.error('Error getting Terabox files:', error);
    throw error;
  }
}

/**
 * Get download/streaming link for a file
 */
export async function getTeraboxDownloadLink(fsid) {
  try {
    const params = new URLSearchParams({
      access_token: process.env.TERABOX_ACCESS_TOKEN,
      method: 'filemetas',
      fsids: JSON.stringify([fsid]),
      dlink: '1'
    });

    const response = await fetch(`${TERABOX_BASE_URL}/xpan/multimedia?${params}`);
    const data = await response.json();

    if (data.errno === 0 && data.list && data.list.length > 0) {
      return data.list[0].dlink;
    } else {
      throw new Error(`Error getting download link: ${data.errmsg}`);
    }
  } catch (error) {
    console.error('Error getting Terabox download link:', error);
    throw error;
  }
}

/**
 * Obtener URL de descarga/streaming para un archivo específico de Terabox
 * @param {string} fileId - ID del archivo en Terabox
 * @returns {Promise<string>} URL de descarga/streaming
 */
export async function getTeraboxDownloadUrl(fileId) {
  try {
    const accessToken = process.env.TERABOX_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error('TERABOX_ACCESS_TOKEN no está configurado');
    }

    // Obtener información del archivo
    const fileInfoResponse = await fetch(`${TERABOX_BASE_URL}/multimedia/file/meta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        access_token: accessToken,
        fsids: `[${fileId}]`
      })
    });

    if (!fileInfoResponse.ok) {
      throw new Error(`Error getting file info: ${fileInfoResponse.status}`);
    }

    const fileInfoData = await fileInfoResponse.json();
    
    if (fileInfoData.errno !== 0) {
      throw new Error(`Terabox API error: ${fileInfoData.errmsg || 'Unknown error'}`);
    }

    const file = fileInfoData.list?.[0];
    if (!file) {
      throw new Error('Archivo no encontrado');
    }

    // Obtener URL de descarga
    const downloadResponse = await fetch(`${TERABOX_BASE_URL}/multimedia/file/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        access_token: accessToken,
        fsid: fileId
      })
    });

    if (!downloadResponse.ok) {
      throw new Error(`Error getting download URL: ${downloadResponse.status}`);
    }

    const downloadData = await downloadResponse.json();
    
    if (downloadData.errno !== 0) {
      throw new Error(`Terabox download API error: ${downloadData.errmsg || 'Unknown error'}`);
    }

    return downloadData.dlink;

  } catch (error) {
    console.error('Error getting Terabox download URL:', error);
    throw error;
  }
}

/**
 * Utility functions for processing movie files
 */

export function isVideoFile(filename) {
  const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv', '.webm', '.m4v'];
  return videoExtensions.some(ext => 
    filename.toLowerCase().endsWith(ext)
  );
}

export function extractMovieTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[\[\(].*?[\]\)]/g, '') // Remove text in [] or ()
    .replace(/\b\d{4}\b/g, '') // Remove years
    .replace(/[._-]/g, ' ') // Replace dots, underscores, hyphens with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

export function extractYear(filename) {
  const yearMatch = filename.match(/\b(19|20)\d{2}\b/);
  return yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
}

export function detectGenre(filename) {
  const genreKeywords = {
    'Acción': ['action', 'fight', 'war', 'battle', 'combat', 'mission'],
    'Comedia': ['comedy', 'funny', 'humor', 'laugh'],
    'Drama': ['drama', 'romantic', 'love', 'life', 'story'],
    'Horror': ['horror', 'scary', 'terror', 'fear', 'nightmare'],
    'Ciencia Ficción': ['sci-fi', 'science', 'future', 'space', 'alien', 'robot'],
    'Fantasía': ['fantasy', 'magic', 'wizard', 'dragon', 'fairy'],
    'Thriller': ['thriller', 'suspense', 'mystery', 'crime'],
    'Aventura': ['adventure', 'quest', 'journey', 'explore'],
    'Animación': ['animated', 'cartoon', 'anime']
  };

  const lowerFilename = filename.toLowerCase();
  
  for (const [genre, keywords] of Object.entries(genreKeywords)) {
    if (keywords.some(keyword => lowerFilename.includes(keyword))) {
      return genre;
    }
  }
  
  return 'Acción'; // Default genre
}

export function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatDuration(seconds) {
  if (!seconds) return 'N/A';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
}
