import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyLoans } from '../services/loans.ts';
import type { BookLoan } from '../types/app/loan-types.ts';
import supabase from '../utils/supabase';

function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [loans, setLoans] = useState<BookLoan[]>([]);
    const [loansLoading, setLoansLoading] = useState(true);
    const [loansError, setLoansError] = useState('');

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!user) {
            return;
        }

        let active = true;
        getMyLoans()
            .then((items) => {
                if (active) {
                    setLoans(items);
                }
            })
            .catch(() => {
                if (active) {
                    setLoansError('No se pudieron cargar tus libros prestados');
                }
            })
            .finally(() => {
                if (active) {
                    setLoansLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [user]);

    if (loading) {
        return null;
    }

    if (!user) {
        return (
            <section className="mx-auto max-w-xl py-10">
                <h1 className="m-0 font-extrabold text-2xl text-[var(--color-primary-strong)]">
                    Tu perfil
                </h1>
                <p className="text-[var(--color-primary-muted)]">
                    Inicia sesión para ver la información de tu cuenta
                </p>
                <Link
                    className="font-bold text-[var(--color-focus)]"
                    to="/login"
                >
                    Iniciar sesión
                </Link>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-xl py-10">
            <Link
                className="text-[var(--color-primary-muted)] text-sm hover:text-[var(--color-primary-strong)]"
                to="/"
            >
                ← Volver al catálogo
            </Link>
            <h1 className="mt-5 mb-2 font-extrabold text-3xl text-[var(--color-primary-strong)] tracking-[-0.02em]">
                Tu perfil
            </h1>

            <dl className="mt-8 grid gap-4 border-[var(--color-border)] border-t pt-5">
                <div>
                    <dt className="font-semibold text-[var(--color-primary-muted)] text-sm">
                        Correo electrónico
                    </dt>
                    <dd className="mt-1 mb-0 text-[var(--color-primary-strong)]">
                        {user.email}
                    </dd>
                </div>
                <div>
                    <dt className="font-semibold text-[var(--color-primary-muted)] text-sm">
                        Cuenta creada
                    </dt>
                    <dd className="mt-1 mb-0 text-[var(--color-primary-strong)]">
                        {user.created_at
                            ? new Date(user.created_at).toLocaleDateString(
                                  'es-ES'
                              )
                            : '—'}
                    </dd>
                </div>
            </dl>

            <section className="mt-10">
                <h2 className="mb-3 border-[var(--color-border)] border-b pb-2 font-bold text-[var(--color-primary-strong)] text-xl">
                    Libros prestados
                </h2>
                {!!loansLoading && (
                    <p
                        className="text-[var(--color-primary-muted)]"
                        role="status"
                    >
                        Cargando tus préstamos…
                    </p>
                )}
                {!!loansError && (
                    <p
                        className="text-[var(--color-primary-strong)]"
                        role="alert"
                    >
                        {loansError}
                    </p>
                )}
                {!(loansLoading || loansError) && loans.length === 0 && (
                    <p className="text-[var(--color-primary-muted)]">
                        Todavía no tienes libros prestados.{' '}
                        <Link
                            className="font-semibold text-[var(--color-focus)]"
                            to="/"
                        >
                            Explorar catálogo
                        </Link>
                    </p>
                )}
                {loans.length > 0 && (
                    <ul className="m-0 divide-y divide-[var(--color-border)] border-[var(--color-border)] border-y p-0">
                        {loans.map((loan) => {
                            const workId = loan.book_key.split('/').at(-1);
                            return (
                                <li
                                    className="flex gap-4 py-4"
                                    key={loan.book_key}
                                >
                                    {loan.cover_id ? (
                                        <img
                                            alt=""
                                            className="h-24 w-16 shrink-0 bg-[var(--color-secondary-soft)] object-cover"
                                            height="96"
                                            src={`https://covers.openlibrary.org/b/id/${loan.cover_id}-S.jpg`}
                                            width="64"
                                        />
                                    ) : (
                                        <div
                                            aria-hidden="true"
                                            className="h-24 w-16 shrink-0 bg-[var(--color-secondary-soft)]"
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <Link
                                            className="font-semibold text-[var(--color-primary-strong)] underline-offset-2 hover:underline"
                                            to={`/books/${workId}`}
                                        >
                                            {loan.title ??
                                                'Título no disponible'}
                                        </Link>
                                        <p className="mt-1 mb-0 text-[var(--color-primary-muted)] text-sm">
                                            Prestado el{' '}
                                            {new Date(
                                                loan.created_at
                                            ).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>
        </section>
    );
}

export default Profile;
