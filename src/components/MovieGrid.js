'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MovieGrid.module.css';

export default function MovieGrid({ movies, loading, searchQuery }) {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Cargando películas...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          {searchQuery ? `Resultados para "${searchQuery}"` : 'Catálogo de Películas'}
        </h2>
        
        {movies.length === 0 ? (
          <div className={styles.noResults}>
            <p>No se encontraron películas.</p>
          </div>
        ) : (
          <div className={styles.movieGrid}>
            {movies.map((movie) => (
              <div
                key={movie.id}
                className={styles.movieCard}
              >
                <div className={styles.moviePoster}>
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    width={300}
                    height={450}
                    className={styles.posterImage}
                  />
                  <div className={styles.movieOverlay}>
                    <Link href={`/movie/${movie.id}`} className={styles.playButton}>
                      ▶ Ver Película
                    </Link>
                    <button 
                      className={styles.infoButton}
                      onClick={() => handleMovieClick(movie)}
                    >
                      ℹ Más Info
                    </button>
                  </div>
                </div>
                <div className={styles.movieInfo}>
                  <h3 className={styles.movieTitle}>{movie.title}</h3>
                  <div className={styles.movieMeta}>
                    <span className={styles.year}>{movie.year}</span>
                    <span className={styles.rating}>⭐ {movie.rating}</span>
                  </div>
                  <p className={styles.genre}>{movie.genre}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para detalles de película */}
      {selectedMovie && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
            <div className={styles.modalHeader}>
              <Image
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                width={200}
                height={300}
                className={styles.modalPoster}
              />
              <div className={styles.modalInfo}>
                <h2>{selectedMovie.title}</h2>
                <div className={styles.modalMeta}>
                  <span>{selectedMovie.year}</span>
                  <span>{selectedMovie.genre}</span>
                  <span>⭐ {selectedMovie.rating}/10</span>
                </div>
                <p className={styles.modalDescription}>
                  {selectedMovie.description}
                </p>
                <div className={styles.modalActions}>
                  <Link 
                    href={`/movie/${selectedMovie.id}`} 
                    className={`${styles.btn} ${styles.btnPrimary}`}
                  >
                    ▶ Ver Película
                  </Link>
                  <button className={`${styles.btn} ${styles.btnSecondary}`}>
                    + Mi Lista
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
