import Link from 'next/link';

export default async function SeriesPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/movies`, { cache: 'no-store' });
  const data = await res.json();
  const series = data.series || [];

  return (
    <main className="container fade-in">
      <h1 className="text-center mb-4">Series</h1>
      <div className="seriesGrid">
        {series.map(serie => (
          <Link key={serie.id} href={`/series/${serie.id}`}>
            <div className="card slide-in">
              <img
                src={serie.episodes[0]?.poster || '/api/placeholder/300/450'}
                alt={serie.title}
                style={{ width: '100%', borderRadius: '8px', marginBottom: '8px' }}
              />
              <h3 className="text-center">{serie.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
