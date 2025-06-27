'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MovieGrid from '../../../components/MovieGrid';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import styles from './page.module.css';

export default function SeriesDetailPage() {
  const params = useParams();
  const { id } = params;
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      const res = await fetch('/api/movies');
      const data = await res.json();
      const found = (data.series || []).find(s => s.id === id);
      setSeries(found);
      setLoading(false);
    };
    if (id) fetchSeries();
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Cargando episodios...</div>;
  }

  if (!series) {
    return <div className={styles.notFound}>Serie no encontrada.</div>;
  }

  return (
    <div className={styles.page}>
      <Header 
        searchQuery={''}
        setSearchQuery={() => {}}
        genres={[]}
        selectedGenre={''}
        setSelectedGenre={() => {}}
      />
      <main className={styles.main}>
        <h1 className={styles.title}>{series.title}</h1>
        <MovieGrid movies={series.episodes} loading={false} searchQuery={''} />
      </main>
      <Footer />
    </div>
  );
}
