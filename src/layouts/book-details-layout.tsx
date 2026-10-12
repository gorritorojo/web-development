import { useCallback } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import AccountMenu from '../components/account-menu';

function BookDetailsLayout() {
    const navigate = useNavigate();
    const goBack = useCallback(() => navigate(-1), [navigate]);

    return (
        <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-text)]">
            <header className="flex items-center justify-between border-[var(--color-border)] border-b px-6 py-4">
                <button
                    className="flex cursor-pointer items-center gap-1.5 bg-transparent text-[var(--color-primary)] text-base"
                    onClick={goBack}
                    type="button"
                >
                    ← Volver
                </button>
                <Link
                    className="font-extrabold text-[var(--color-primary-strong)] tracking-[-0.02em] no-underline hover:text-[var(--color-focus)]"
                    to="/"
                >
                    honya
                </Link>
                <AccountMenu />
            </header>
            <main className="flex-1 bg-[var(--color-background)] p-8">
                <Outlet />
            </main>
        </div>
    );
}

export default BookDetailsLayout;
