import { useEffect, useState } from 'react';
import BookCard from '../components/book-card';
import { loadHomeBooks } from '../services/books';
import type { HomeSection } from '../types/app/home-service-types.ts';

function Home() {
    const [sections, setSections] = useState<HomeSection[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        loadHomeBooks()
            .then((result) => {
                if (active) {
                    setSections(result);
                }
            })
            .catch(() => {
                if (active) {
                    setError('Could not load books');
                }
            });

        return () => {
            active = false;
        };
    }, []);

    return (
        <main className="mx-auto box-border w-full max-w-[76rem] px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.5rem,3vw,2.75rem)]">
            <h1 className="mb-9 font-bold text-[var(--color-primary-strong)] text-[var(--type-title)] leading-[1.1] tracking-[-0.03em]">
                Books
            </h1>
            {error ? (
                <p
                    className="max-w-[65ch] rounded-lg border border-[var(--color-secondary)] bg-[var(--color-secondary-soft)] px-4 py-3 text-[var(--color-primary-strong)]"
                    role="alert"
                >
                    {error}
                </p>
            ) : null}
            {!error && sections.length === 0 && (
                <p className="max-w-[65ch] text-[var(--color-text-muted)]">
                    Loading books…
                </p>
            )}
            <div className="space-y-[clamp(2.5rem,5vw,4rem)]">
                {sections.map(({ books, name }) => (
                    <section key={name}>
                        <h2 className="mb-4 border-[var(--color-border)] border-b pb-[0.65rem] font-semibold text-[var(--color-primary-strong)] text-[var(--type-section)] leading-[1.2] tracking-[-0.015em]">
                            {name}
                        </h2>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-[clamp(1rem,2vw,1.5rem)]">
                            {books.map((book) => (
                                <BookCard book={book} key={book.key} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}

export default Home;
