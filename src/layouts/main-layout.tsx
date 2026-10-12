import { useCallback, useEffect, useState } from 'react';
import {
    Link,
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import AccountMenu from '../components/account-menu';
import { OPEN_LIBRARY_SUBJECTS } from '../constants/genres';
import { useDebounce } from '../hooks/use-debounce';

function genreLinkClass({ isActive }: { isActive: boolean }) {
    return [
        'block rounded-md px-2 py-1 text-[var(--color-primary)] no-underline transition-colors duration-150 ease-out hover:bg-[var(--color-secondary-soft)] hover:text-[var(--color-primary-strong)]',
        isActive
            ? 'bg-[var(--color-secondary)] font-bold text-[var(--color-primary-strong)] shadow-[inset_3px_0_var(--color-primary)]'
            : 'font-normal',
    ].join(' ');
}

function MainLayout() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') ?? '');
    const debouncedQuery = useDebounce(query, 400);
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value),
        []
    );

    const { pathname } = useLocation();

    useEffect(() => {
        if (pathname !== '/search') {
            setQuery('');
        }
    }, [pathname]);

    useEffect(() => {
        if (debouncedQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
        }
    }, [debouncedQuery, navigate]);

    return (
        <div className="grid h-screen grid-cols-[200px_1fr] grid-rows-[auto_1fr] overflow-hidden bg-[var(--color-background)] text-[var(--color-text)] max-[720px]:grid-cols-1 max-[720px]:grid-rows-[auto_auto_1fr]">
            <header className="z-10 col-span-2 grid grid-cols-3 items-center border-[var(--color-border)] border-b bg-[var(--color-surface)] p-4 text-[var(--color-primary)] shadow-[0_2px_14px_rgb(76_69_65_/_8%)] max-[720px]:col-span-1 max-[600px]:grid-cols-1 max-[720px]:grid-cols-[auto_1fr_auto] max-[720px]:gap-3">
                <Link
                    className="font-extrabold text-[var(--color-primary-strong)] tracking-[-0.02em] no-underline hover:text-[var(--color-focus)]"
                    to="/"
                >
                    honya
                </Link>
                <input
                    className="w-[min(100%,20rem)] justify-self-center rounded border border-[var(--color-border)] bg-[var(--color-background-subtle)] px-4 py-2 text-[var(--color-primary)] caret-[var(--color-primary)] outline-none placeholder:text-[var(--color-primary-muted)] focus:border-[var(--color-primary)] focus-visible:outline-none! max-[600px]:w-auto max-[600px]:justify-self-stretch"
                    onChange={handleChange}
                    placeholder="buscar…"
                    type="search"
                    value={query}
                />
                <AccountMenu />
            </header>

            <aside className="overflow-y-auto border-[var(--color-border)] border-r bg-[var(--color-background-subtle)] p-4 max-[720px]:max-h-36 max-[720px]:border-r-0 max-[720px]:border-b">
                <p className="mb-2 font-semibold text-[var(--color-primary-muted)] text-xs uppercase tracking-wide">
                    Géneros
                </p>
                <ul className="m-0 list-none p-0 max-[720px]:grid max-[720px]:grid-cols-2 max-[720px]:gap-x-2 max-[720px]:gap-y-0.5">
                    {OPEN_LIBRARY_SUBJECTS.map(({ api, name }) => (
                        <li key={api}>
                            <NavLink
                                className={genreLinkClass}
                                to={`/genre/${api}`}
                            >
                                {name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </aside>
            <main className="overflow-y-auto p-8">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
