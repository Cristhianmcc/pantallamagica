// Utility functions for Google Drive API integration
// Alternativa más fácil que Terabox

const GOOGLE_DRIVE_BASE_URL = 'https://www.googleapis.com/drive/v3';
const GOOGLE_DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3';

/**
 * Get file information from Google Drive
 * @param {string} fileId - Google Drive file ID
 * @returns {Promise<Object>} File information
 */
export async function getGoogleDriveFile(fileId) {
  try {
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_DRIVE_API_KEY no está configurado');
    }

    const response = await fetch(
      `${GOOGLE_DRIVE_BASE_URL}/files/${fileId}?fields=id,name,mimeType,size,webContentLink,webViewLink,thumbnailLink&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error getting file info: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting Google Drive file:', error);
    throw error;
  }
}

/**
 * Get list of video files from a Google Drive folder
 * @param {string} folderId - Google Drive folder ID
 * @returns {Promise<Array>} List of video files
 */
export async function getGoogleDriveMovies(folderId) {
  try {
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_DRIVE_API_KEY no está configurado');
    }

    // Query to get video files from the folder
    const query = `'${folderId}' in parents and (mimeType contains 'video' or name contains '.mp4' or name contains '.mkv' or name contains '.avi')`;
    
    const response = await fetch(
      `${GOOGLE_DRIVE_BASE_URL}/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,size,webContentLink,webViewLink,thumbnailLink)&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error getting movies: ${response.status}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error getting Google Drive movies:', error);
    throw error;
  }
}

/**
 * Get list of folders (subcarpetas) from a Google Drive folder
 * @param {string} folderId - Google Drive folder ID
 * @returns {Promise<Array>} List of folders
 */
export async function getGoogleDriveFolders(folderId) {
  try {
    const apiKey = process.env.GOOGLE_DRIVE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_DRIVE_API_KEY no está configurado');
    }
    const query = `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`;
    const response = await fetch(
      `${GOOGLE_DRIVE_BASE_URL}/files?q=${encodeURIComponent(query)}&fields=files(id,name)&key=${apiKey}`
    );
    if (!response.ok) {
      throw new Error(`Error getting folders: ${response.status}`);
    }
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error getting Google Drive folders:', error);
    throw error;
  }
}

/**
 * Get direct download/streaming URL for Google Drive file
 * @param {string} fileId - Google Drive file ID
 * @returns {string} Streaming URL
 */
export function getGoogleDriveStreamUrl(fileId) {
  // URL para streaming directo de Google Drive
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Get embed URL for Google Drive video
 * @param {string} fileId - Google Drive file ID
 * @returns {string} Embed URL
 */
export function getGoogleDriveEmbedUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Convert Google Drive file to movie format for the app
 * @param {Object} driveFile - Google Drive file object
 * @returns {Object} Movie object for the app
 */
export function convertDriveFileToMovie(driveFile) {
  const title = extractMovieTitle(driveFile.name);
  const year = extractYear(driveFile.name);
  const genre = detectGenre(driveFile.name);

  return {
    id: driveFile.id,
    title: title,
    poster: driveFile.thumbnailLink || `/api/placeholder/300/450`,
    genre: genre,
    year: year,
    rating: (Math.random() * (10 - 6) + 6).toFixed(1), // Rating aleatorio
    description: `${title} - Una increíble película para disfrutar.`,
    videoUrl: getGoogleDriveStreamUrl(driveFile.id),
    embedUrl: getGoogleDriveEmbedUrl(driveFile.id),
    duration: '2h 0min', // Por defecto, ya que Google Drive no proporciona duración
    size: formatFileSize(parseInt(driveFile.size) || 0),
    filename: driveFile.name,
    source: 'google_drive'
  };
}

// Funciones utilitarias reutilizables
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
