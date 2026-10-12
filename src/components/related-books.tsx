import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchBooks } from '../services/books';
import type { Book } from '../types/api/book';

function RelatedBooks({ subjects }: { subjects: string[] }) {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        if (subjects.length === 0) {
            return;
        }
        let active = true;

        searchBooks(subjects[0], 0, 6).then(({ books: result }) => {
            if (active) {
                setBooks(result);
            }
        });
        return () => {
            active = false;
        };
    }, [subjects]);

    if (books.length === 0) {
        return null;
    }

    return (
        <section className="mt-12">
            <h2 className="mb-4 font-semibold text-[var(--color-primary-strong)] text-[var(--type-section)]">
                Libros similares
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
                {books.map((book) => {
                    const workId = book.key.replace('/works/', '');
                    return (
                        <Link
                            className="w-[100px] shrink-0 text-center text-[var(--color-text)] no-underline"
                            key={book.key}
                            to={`/books/${workId}`}
                        >
                            {book.cover_i ? (
                                <img
                                    alt={`Portada de ${book.title}`}
                                    className="block h-[135px] w-[90px] rounded-md object-cover"
                                    height={135}
                                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                                    width={90}
                                />
                            ) : (
                                <div className="flex h-[135px] w-[90px] items-center justify-center rounded-md bg-[var(--color-secondary-soft)] text-[var(--color-primary-muted)] text-xs">
                                    Sin portada
                                </div>
                            )}
                            <p className="mt-1.5 line-clamp-2 overflow-hidden text-xs leading-[1.3]">
                                {book.title}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export default RelatedBooks;
