'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Hero.module.css';

export default function Hero({ movies }) {
  const [currentMovie, setCurrentMovie] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (movies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % Math.min(movies.length, 3));
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) {
    return (
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Cargando películas...</h1>
        </div>
      </section>
    );
  }

  const movie = movies[currentMovie] || movies[0];

  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className={styles.heroImage}
          priority={currentMovie === 0}
        />
        <div className={styles.heroOverlay}></div>
      </div>

      <div className={styles.heroContent}>
        <div className={styles.container}>
          <div className={styles.movieInfo}>
            <h1 className={styles.heroTitle}>{movie.title}</h1>
            <p className={styles.heroDescription}>
              {movie.description}
            </p>
            <div className={styles.movieMeta}>
              <span className={styles.year}>{movie.year}</span>
              <span className={styles.genre}>{movie.genre}</span>
              <span className={styles.rating}>
                ⭐ {movie.rating}/10
              </span>
            </div>
            <div className={styles.heroActions}>
              <button
                className={`${styles.btn} ${styles.btnPrimary}`}
                onClick={() => router.push(`/movie/${movie.id}`)}
              >
                ▶ Reproducir
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                + Mi Lista
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                ℹ Más Info
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.heroIndicators}>
        {movies.slice(0, 3).map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              index === currentMovie ? styles.indicatorActive : ''
            }`}
            onClick={() => setCurrentMovie(index)}
          />
        ))}
      </div>
    </section>
  );
}
