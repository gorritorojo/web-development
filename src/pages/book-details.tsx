import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import RelatedBooks from '../components/related-books';
import { useWorkDetails } from '../hooks/use-work-details';
import { borrowBook, getBookStatus, returnBook } from '../services/loans.ts';
import type { BookDetailsParam } from '../types/app/book-details-param.ts';
import type { BookStatus } from '../types/app/loan-types.ts';

function descriptionText(
    desc: { value: string } | string | undefined
): string | null {
    if (!desc) {
        return null;
    }
    return typeof desc === 'string' ? desc : desc.value;
}

export default function BookDetails() {
    const { bookId } = useParams<BookDetailsParam>();
    const state = useWorkDetails(bookId ?? '');
    const [bookStatus, setBookStatus] = useState<BookStatus | null>(null);
    const [statusLoading, setStatusLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [loanError, setLoanError] = useState('');
    const [loanMessage, setLoanMessage] = useState('');

    useEffect(() => {
        let active = true;
        setBookStatus(null);
        setStatusLoading(true);
        setLoanError('');
        setLoanMessage('');

        getBookStatus(`/works/${bookId}`)
            .then((status) => {
                if (active) {
                    setBookStatus(status);
                }
            })
            .catch(() => {
                if (active) {
                    setLoanError('No se pudo consultar la disponibilidad');
                }
            })
            .finally(() => {
                if (active) {
                    setStatusLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [bookId]);

    async function handleLoanAction() {
        if (!(bookId && bookStatus) || state.status !== 'done') {
            return;
        }

        setActionLoading(true);
        setLoanError('');
        setLoanMessage('');
        const bookKey = `/works/${bookId}`;
        const borrowing = !bookStatus.borrowed_by_me;
        const successMessage = borrowing
            ? 'Libro pedido prestado correctamente'
            : 'Libro devuelto correctamente';

        try {
            if (borrowing) {
                await borrowBook(
                    bookKey,
                    state.data.title,
                    state.data.covers?.[0]
                );
            } else {
                await returnBook(bookKey);
            }

            const updatedStatus = await getBookStatus(bookKey);
            const actionApplied = borrowing
                ? updatedStatus.borrowed_by_me
                : updatedStatus.available;
            setBookStatus(updatedStatus);

            if (!actionApplied) {
                throw new Error('Loan status was not updated');
            }
            setLoanMessage(successMessage);
        } catch {
            try {
                const currentStatus = await getBookStatus(bookKey);
                setBookStatus(currentStatus);
                const actionApplied = borrowing
                    ? currentStatus.borrowed_by_me
                    : currentStatus.available;
                if (actionApplied) {
                    setLoanMessage(successMessage);
                    return;
                }
            } catch {
                // Keep the original action error visible if status cannot be rechecked.
            }
            setLoanError(
                'No se confirmó el cambio. Comprueba tu conexión y sesión e inténtalo de nuevo'
            );
        } finally {
            setActionLoading(false);
        }
    }

    return (
        <div className="mx-auto box-border w-full max-w-[56rem] px-[clamp(1rem,3vw,2.5rem)] py-[clamp(1.5rem,3vw,2.75rem)]">
            {state.status === 'loading' && (
                <p className="text-(--color-text-muted)">Cargando…</p>
            )}
            {state.status === 'error' && (
                <p
                    className="max-w-[65ch] rounded-lg border border-[var(--color-secondary)] bg-[var(--color-secondary-soft)] px-4 py-3 text-[var(--color-primary-strong)]"
                    role="alert"
                >
                    {state.message}
                </p>
            )}
            {state.status === 'done' && (
                <>
                    <article className="flex items-start gap-8 max-[600px]:flex-col">
                        {!!state.data.covers?.[0] && (
                            <img
                                alt={`Portada de ${state.data.title}`}
                                className="w-[220px] shrink-0 border border-[var(--color-border)] shadow-[0_8px_22px_rgb(76_69_65_/_12%)] max-[600px]:w-[min(100%,15rem)]"
                                height={330}
                                src={`https://covers.openlibrary.org/b/id/${state.data.covers[0]}-L.jpg`}
                                width={220}
                            />
                        )}
                        <div className="min-w-0">
                            <h1 className="mb-4 font-bold text-[var(--color-primary-strong)] text-[var(--type-title)] leading-[1.1] tracking-[-0.03em]">
                                {state.data.title}
                            </h1>
                            {descriptionText(state.data.description) && (
                                <p className="max-w-[68ch] whitespace-pre-line text-[var(--color-text)] leading-[1.7]">
                                    {descriptionText(state.data.description)}
                                </p>
                            )}
                            <section
                                aria-label="Estado del préstamo"
                                aria-live="polite"
                                className="mt-6 border-[var(--color-border)] border-t pt-4"
                            >
                                <h2 className="mb-2 font-semibold text-[var(--color-primary-strong)] text-lg">
                                    Disponibilidad
                                </h2>
                                {!!statusLoading && (
                                    <p className="m-0 text-[var(--color-text-muted)]">
                                        Consultando disponibilidad…
                                    </p>
                                )}
                                {!statusLoading && bookStatus?.available && (
                                    <>
                                        <p className="mb-3 text-[var(--color-text)]">
                                            Disponible para préstamo
                                        </p>
                                        <button
                                            className="cursor-pointer rounded-md bg-[var(--color-primary-strong)] px-4 py-2.5 font-bold text-[var(--color-background-subtle)] transition-colors hover:bg-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                                            disabled={actionLoading}
                                            onClick={handleLoanAction}
                                            type="button"
                                        >
                                            {actionLoading
                                                ? 'Procesando…'
                                                : 'Pedir prestado'}
                                        </button>
                                    </>
                                )}
                                {!statusLoading &&
                                    bookStatus?.borrowed_by_me && (
                                        <>
                                            <p className="mb-3 text-[var(--color-text)]">
                                                Tienes este libro prestado
                                            </p>
                                            <button
                                                className="cursor-pointer rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 font-semibold text-[var(--color-primary-strong)] transition-colors hover:bg-[var(--color-secondary-soft)] disabled:cursor-not-allowed disabled:opacity-60"
                                                disabled={actionLoading}
                                                onClick={handleLoanAction}
                                                type="button"
                                            >
                                                {actionLoading
                                                    ? 'Procesando…'
                                                    : 'Devolver libro'}
                                            </button>
                                        </>
                                    )}
                                {!statusLoading &&
                                    bookStatus &&
                                    !bookStatus.available &&
                                    !bookStatus.borrowed_by_me && (
                                        <p className="m-0 text-[var(--color-text-muted)]">
                                            Este libro está prestado a otro
                                            usuario
                                        </p>
                                    )}
                                {!!loanError && (
                                    <p
                                        className="mt-3 mb-0 text-[var(--color-primary-strong)] text-sm"
                                        role="alert"
                                    >
                                        {loanError}{' '}
                                        {loanError.includes('sesión') && (
                                            <Link
                                                className="font-semibold underline underline-offset-2"
                                                to="/login"
                                            >
                                                Iniciar sesión
                                            </Link>
                                        )}
                                    </p>
                                )}
                                {!!loanMessage && (
                                    <p
                                        className="mt-3 mb-0 text-[var(--color-primary-strong)] text-sm"
                                        role="status"
                                    >
                                        {loanMessage}
                                    </p>
                                )}
                            </section>
                            {state.data.subjects &&
                                state.data.subjects.length > 0 && (
                                    <ul className="mt-4 flex list-none flex-wrap gap-1.5 p-0">
                                        {state.data.subjects
                                            .slice(0, 6)
                                            .map((s) => (
                                                <li
                                                    className="rounded-full border border-[var(--color-secondary)] bg-[var(--color-secondary-soft)] px-2.5 py-1 text-[var(--color-primary-strong)] text-xs"
                                                    key={s}
                                                >
                                                    <Link
                                                        className="text-[var(--color-primary-strong)] no-underline"
                                                        to={`/search?q=${encodeURIComponent(s)}`}
                                                    >
                                                        {s}
                                                    </Link>
                                                </li>
                                            ))}
                                    </ul>
                                )}
                        </div>
                    </article>
                    <RelatedBooks subjects={state.data.subjects ?? []} />
                </>
            )}
        </div>
    );
}
