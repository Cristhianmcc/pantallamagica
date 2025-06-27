import { NextResponse } from 'next/server';
import {
  getGoogleDriveMovies,
  getGoogleDriveFolders,
  convertDriveFileToMovie
} from '../../../utils/googledrive';

export async function GET() {
  try {
    // Obtener películas
    let movies = [];
    if (process.env.GOOGLE_DRIVE_MOVIES_FOLDER_ID) {
      const movieFiles = await getGoogleDriveMovies(process.env.GOOGLE_DRIVE_MOVIES_FOLDER_ID);
      movies = movieFiles.map(file => convertDriveFileToMovie(file));
    }

    // Obtener series y episodios
    let series = [];
    if (process.env.GOOGLE_DRIVE_SERIES_FOLDER_ID) {
      // Obtener subcarpetas (series)
      const seriesFolders = await getGoogleDriveFolders(process.env.GOOGLE_DRIVE_SERIES_FOLDER_ID);
      for (const folder of seriesFolders) {
        const episodes = await getGoogleDriveMovies(folder.id);
        series.push({
          title: folder.name,
          id: folder.id,
          episodes: episodes.map(file => convertDriveFileToMovie(file))
        });
      }
    }

    return NextResponse.json({
      success: true,
      movies,
      series
    });
  } catch (error) {
    console.error('Error fetching movies and series:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
