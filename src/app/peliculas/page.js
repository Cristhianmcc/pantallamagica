import MovieGrid from '../../components/MovieGrid';

export default async function PeliculasPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`, { cache: 'no-store' });
  const data = await res.json();
  const movies = data.movies || [];

  return (
    <main className="container fade-in">
      <h1 className="text-center mb-4">Películas</h1>
      <MovieGrid movies={movies} />
    </main>
  );
}
