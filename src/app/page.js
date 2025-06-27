'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import MovieGrid from '../components/MovieGrid';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import styles from './page.module.css';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/movies');
        const data = await response.json();
        setMovies(data.movies || []);
        setSeries(data.series || []);
      } catch (error) {
        console.error('Error fetching catalog:', error);
        setMovies(getSampleMovies());
        setSeries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const getSampleMovies = () => [
    {
      id: 1,
      title: "Avatar: The Way of Water",
      poster: "/api/placeholder/300/450",
      genre: "Ciencia Ficción",
      year: 2022,
      rating: 8.5,
      description: "Jake Sully y Ney'tiri han formado una familia y hacen todo lo posible por permanecer juntos. Sin embargo, deben abandonar su hogar y explorar las regiones de Pandora."
    },
    {
      id: 2,
      title: "Top Gun: Maverick",
      poster: "/api/placeholder/300/450",
      genre: "Acción",
      year: 2022,
      rating: 8.7,
      description: "Después de más de 30 años de servicio como uno de los mejores aviadores de la Armada, Pete 'Maverick' Mitchell se encuentra entrenando a un destacamento de graduados de Top Gun."
    },
    {
      id: 3,
      title: "Black Panther: Wakanda Forever",
      poster: "/api/placeholder/300/450",
      genre: "Acción",
      year: 2022,
      rating: 7.3,
      description: "La reina Ramonda, Shuri, M'Baku, Okoye y las Dora Milaje luchan para proteger su nación de las potencias mundiales que intervienen tras la muerte del rey T'Challa."
    },
    {
      id: 4,
      title: "Doctor Strange in the Multiverse of Madness",
      poster: "/api/placeholder/300/450",
      genre: "Fantasía",
      year: 2022,
      rating: 7.0,
      description: "El Dr. Stephen Strange desata un mal indescriptible al lanzar un hechizo prohibido que abre la puerta al multiverso."
    },
    {
      id: 5,
      title: "Minions: The Rise of Gru",
      poster: "/api/placeholder/300/450",
      genre: "Animación",
      year: 2022,
      rating: 6.5,
      description: "En los años 70, Gru crece en los suburbios y es un gran fanático de un grupo de supervillanos conocido como Vicious 6."
    },
    {
      id: 6,
      title: "Thor: Love and Thunder",
      poster: "/api/placeholder/300/450",
      genre: "Acción",
      year: 2022,
      rating: 6.8,
      description: "Thor emprende un viaje diferente a todo lo que ha enfrentado: una búsqueda de la paz interior. Pero su retiro se ve interrumpido por Gorr el Carnicero de Dioses."
    }
  ];

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'all' || movie.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });
  const genres = ['all', ...new Set(movies.map(movie => movie.genre))];

  return (
    <div className={styles.page}>
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        genres={genres}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />
      <main className={styles.main}>
        <Hero movies={movies} />
        <MovieGrid 
          movies={filteredMovies}
          loading={loading}
          searchQuery={searchQuery}
        />
        {/* Sección de series */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle} style={{marginTop: '3rem'}}>Catálogo de Series</h2>
          {loading ? (
            <div className={styles.loadingContainer}><div className={styles.spinner}></div> Cargando series...</div>
          ) : series.length === 0 ? (
            <div className={styles.noResults}><p>No se encontraron series.</p></div>
          ) : (
            <div className={styles.seriesGrid}>
              {series.map(serie => (
                <a
                  key={serie.id}
                  href={`/series/${serie.id}`}
                  className={styles.seriesCard}
                >
                  <div className={styles.seriesPosterWrapper}>
                    <img
                      src={serie.episodes[0]?.poster || '/api/placeholder/300/450'}
                      alt={serie.title}
                      className={styles.seriesPoster}
                      width={180}
                      height={270}
                    />
                  </div>
                  <div className={styles.seriesInfo}>
                    <h3 className={styles.seriesTitle}>{serie.title}</h3>
                    <span className={styles.episodeCount}>{serie.episodes.length} episodio{serie.episodes.length !== 1 ? 's' : ''}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
