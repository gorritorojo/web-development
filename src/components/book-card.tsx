import { Link } from 'react-router-dom';
import type { Book } from '../types/api/book';

function BookCard({ book }: { book: Book }) {
    const bookKey = book.key.split('/').at(-1);
    const bookTo = `/books/${bookKey}`;

    return (
        <Link
            className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-primary)] no-underline transition-[border-color,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:border-[var(--color-secondary)] hover:shadow-[0_8px_20px_rgb(76_69_65_/_12%)]"
            to={bookTo}
        >
            {book.cover_i ? (
                <img
                    alt={`Cover of ${book.title}`}
                    className="block aspect-2/3 w-full bg-[var(--color-secondary-soft)] object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                    height="270"
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                    width="180"
                />
            ) : (
                <div
                    aria-label="No cover available"
                    className="flex aspect-[2/3] w-full items-center justify-center bg-[var(--color-secondary-soft)] px-4 text-center text-[var(--color-primary-muted)] text-xs uppercase tracking-wide"
                    role="img"
                >
                    No cover
                </div>
            )}
            <div className="flex min-h-[7.25rem] flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 min-h-[2.7em] font-semibold text-[var(--color-primary-strong)] text-base leading-[1.35]">
                    {book.title}
                </h3>
                <p className="mt-auto line-clamp-2 text-[var(--color-text-muted)] text-[var(--type-meta)] leading-[1.4]">
                    {book.author_name?.join(', ') ?? 'Unknown author'}
                </p>
            </div>
        </Link>
    );
}

export default BookCard;
