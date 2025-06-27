'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './page.module.css';

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [streamUrl, setStreamUrl] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/movies');
        const data = await response.json();
        const movieId = await params.id;
        let foundMovie = data.movies.find(m => m.id.toString() === movieId);
        if (!foundMovie) {
          // Buscar en episodios de series
          for (const serie of data.series || []) {
            foundMovie = serie.episodes.find(ep => ep.id.toString() === movieId);
            if (foundMovie) break;
          }
        }
        setMovie(foundMovie);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [params.id]);

  const handlePlay = async () => {
    try {
      const movieId = await params.id;
      const response = await fetch(`/api/stream/${movieId}`);
      const data = await response.json();
      if (data.success) {
        setStreamUrl(data.streamUrl);
        setShowPlayer(true);
      }
    } catch (error) {
      console.error('Error getting stream URL:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando película...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={styles.errorContainer}>
        <h1>Película no encontrada</h1>
        <button onClick={() => router.back()} className={styles.backButton}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className={styles.moviePage}>
      {/* Header con botón de regreso */}
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          ← Volver
        </button>
      </header>

      {/* Reproductor de video */}
      {showPlayer && streamUrl && (
        <div className={styles.playerContainer}>
          <div className={styles.player}>
            <button 
              className={styles.closePlayer}
              onClick={() => setShowPlayer(false)}
            >
              ×
            </button>
            {/* Si el streamUrl es de Google Drive, usar iframe */}
            {streamUrl.includes('drive.google.com') ? (
              <iframe
                src={streamUrl.replace('uc?export=download&id=', 'file/d/') + '/preview'}
                width="100%"
                height="480"
                allow="autoplay"
                allowFullScreen
                frameBorder="0"
                className={styles.video}
              />
            ) : (
              <video 
                controls 
                autoPlay 
                className={styles.video}
                poster={movie.poster}
              >
                <source src={streamUrl} type="video/mp4" />
                Tu navegador no soporta el elemento de video.
              </video>
            )}
          </div>
        </div>
      )}

      {/* Información de la película */}
      <div className={styles.movieContent}>
        <div className={styles.moviePoster}>
          <Image
            src={movie.poster}
            alt={movie.title}
            width={400}
            height={600}
            className={styles.posterImage}
          />
        </div>

        <div className={styles.movieDetails}>
          <h1 className={styles.movieTitle}>{movie.title}</h1>
          
          <div className={styles.movieMeta}>
            <span className={styles.year}>{movie.year}</span>
            <span className={styles.genre}>{movie.genre}</span>
            <span className={styles.rating}>⭐ {movie.rating}/10</span>
            {movie.duration && <span className={styles.duration}>{movie.duration}</span>}
          </div>

          <p className={styles.movieDescription}>
            {movie.description}
          </p>

          <div className={styles.actionButtons}>
            <button 
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handlePlay}
            >
              ▶ Reproducir
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>
              + Agregar a Mi Lista
            </button>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>
              📥 Descargar
            </button>
          </div>

          <div className={styles.additionalInfo}>
            <div className={styles.infoSection}>
              <h3>Detalles</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>Año:</strong> {movie.year}
                </div>
                <div className={styles.infoItem}>
                  <strong>Género:</strong> {movie.genre}
                </div>
                <div className={styles.infoItem}>
                  <strong>Calificación:</strong> {movie.rating}/10
                </div>
                {movie.duration && (
                  <div className={styles.infoItem}>
                    <strong>Duración:</strong> {movie.duration}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
