import { NextResponse } from 'next/server';
import { getTeraboxDownloadUrl } from '../../../../utils/terabox';
import { getGoogleDriveStreamUrl, getGoogleDriveEmbedUrl } from '../../../../utils/googledrive';

export async function GET(request, { params }) {
  const { movieId } = await params;
  
  try {
    // Verificar si se debe usar Google Drive
    if (process.env.USE_GOOGLE_DRIVE === 'true' && process.env.GOOGLE_DRIVE_API_KEY) {
      console.log(`Getting Google Drive stream URL for movie ID: ${movieId}`);
      
      try {
        const streamUrl = getGoogleDriveStreamUrl(movieId);
        const embedUrl = getGoogleDriveEmbedUrl(movieId);
        
        return NextResponse.json({
          success: true,
          streamUrl: streamUrl,
          embedUrl: embedUrl,
          movieId: movieId,
          quality: ['480p', '720p', '1080p'],
          subtitles: [
            { language: 'es', url: '/subtitles/spanish.vtt' },
            { language: 'en', url: '/subtitles/english.vtt' }
          ],
          source: 'google_drive'
        });
      } catch (driveError) {
        console.error('Error getting Google Drive stream URL:', driveError);
        // Continuar con Terabox o demo como fallback
      }
    }

    // Intentar obtener URL de streaming real desde Terabox
    if (process.env.TERABOX_ACCESS_TOKEN) {
      try {
        console.log(`Getting stream URL for movie ID: ${movieId}`);
        
        // Obtener URL de descarga/streaming desde Terabox
        const streamUrl = await getTeraboxDownloadUrl(movieId);
        
        if (streamUrl) {
          return NextResponse.json({
            success: true,
            streamUrl: streamUrl,
            movieId: movieId,
            quality: ['480p', '720p', '1080p'],
            subtitles: [
              { language: 'es', url: '/subtitles/spanish.vtt' },
              { language: 'en', url: '/subtitles/english.vtt' }
            ],
            source: 'terabox'
          });
        }
      } catch (teraboxError) {
        console.error('Error getting Terabox stream URL:', teraboxError);
        // Continuar con URLs de demostración como fallback
      }
    }

    // Fallback: URLs de demostración si no hay Terabox o hay error
    const demoStreamUrls = {
      '1': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      '2': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      '3': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      '4': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      '5': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      '6': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
    };

    const streamUrl = demoStreamUrls[movieId] || demoStreamUrls['1'];

    return NextResponse.json({
      success: true,
      streamUrl: streamUrl,
      movieId: movieId,
      quality: ['480p', '720p', '1080p'],
      subtitles: [
        { language: 'es', url: '/subtitles/spanish.vtt' },
        { language: 'en', url: '/subtitles/english.vtt' }
      ],
      source: 'demo'
    });

  } catch (error) {
    console.error('Error getting stream URL:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener el enlace de streaming' 
      },
      { status: 500 }
    );
  }
}
