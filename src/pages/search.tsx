import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/book-card';
import { PAGE_SIZE, searchBooks } from '../services/books';
import type { Book } from '../types/api/book.ts';

function Search() {
    const [searchParams] = useSearchParams();
    const q = searchParams.get('q') ?? '';

    const [books, setBooks] = useState<Book[]>([]);
    const [numFound, setNumFound] = useState(0);
    const [offset, setOffset] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
    const totalPages = Math.ceil(numFound / PAGE_SIZE);

    const prevPage = useCallback(
        () => setOffset((o) => Math.max(0, o - PAGE_SIZE)),
        []
    );
    const nextPage = useCallback(() => setOffset((o) => o + PAGE_SIZE), []);

    useEffect(() => {
        setOffset(0);
    }, []);

    useEffect(() => {
        if (!q.trim()) {
            setBooks([]);
            setNumFound(0);
            return;
        }
        let active = true;
        setLoading(true);
        setError(null);

        searchBooks(q, offset)
            .then(({ books: result, numFound: total }) => {
                if (active) {
                    setBooks(result);
                    setNumFound(total);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (active) {
                    setError('Could not load results');
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [q, offset]);

    if (!q.trim()) {
        return (
            <main className="mx-auto box-border w-full max-w-[76rem] px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.5rem,3vw,2.75rem)]">
                <h1 className="mb-9 font-bold text-[var(--color-primary-strong)] text-[var(--type-title)] leading-[1.1] tracking-[-0.03em]">
                    Buscar
                </h1>
                <p className="max-w-[65ch] text-[var(--color-text-muted)]">
                    Escribe algo en el buscador para ver resultados
                </p>
            </main>
        );
    }

    return (
        <main className="mx-auto box-border w-full max-w-[76rem] px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.5rem,3vw,2.75rem)]">
            <h1 className="mb-9 font-bold text-[var(--color-primary-strong)] text-[var(--type-title)] leading-[1.1] tracking-[-0.03em]">
                Resultados para &ldquo;{q}&rdquo;
            </h1>
            {numFound > 0 && !loading && (
                <p className="text-[var(--color-text-muted)]">
                    {numFound} resultados encontrados
                </p>
            )}
            {error ? (
                <p
                    className="max-w-[65ch] rounded-lg border border-[var(--color-secondary)] bg-[var(--color-secondary-soft)] px-4 py-3 text-[var(--color-primary-strong)]"
                    role="alert"
                >
                    {error}
                </p>
            ) : null}
            {loading ? (
                <p className="max-w-[65ch] text-[var(--color-text-muted)]">
                    Buscando…
                </p>
            ) : null}
            {!(loading || error) && books.length === 0 && (
                <p className="max-w-[65ch] text-[var(--color-text-muted)]">
                    No se encontraron resultados
                </p>
            )}
            {!(loading || error) && books.length > 0 && (
                <>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
                        {books.map((book) => (
                            <BookCard book={book} key={book.key} />
                        ))}
                    </div>
                    <div className="mt-8 flex flex-wrap items-center gap-3 text-[var(--color-text-muted)] text-[var(--type-meta)]">
                        <button
                            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-semibold text-[var(--color-primary-strong)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary-soft)] disabled:cursor-not-allowed disabled:opacity-55"
                            disabled={offset === 0}
                            onClick={prevPage}
                            type="button"
                        >
                            ← Anterior
                        </button>
                        <span>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-semibold text-[var(--color-primary-strong)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary-soft)] disabled:cursor-not-allowed disabled:opacity-55"
                            disabled={offset + PAGE_SIZE >= numFound}
                            onClick={nextPage}
                            type="button"
                        >
                            Siguiente →
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}

export default Search;
