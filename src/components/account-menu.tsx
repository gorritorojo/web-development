import type { User } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/theme-context';
import supabase from '../utils/supabase';

function UserIcon() {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            height="18"
            viewBox="0 0 24 24"
            width="18"
        >
            <circle
                cx="12"
                cy="8"
                r="3.25"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M5.5 19.25c.7-3.1 3.05-4.75 6.5-4.75s5.8 1.65 6.5 4.75"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
            />
        </svg>
    );
}

function AccountMenu() {
    const navigate = useNavigate();
    const { toggleTheme } = useTheme();
    const menuRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        supabase.auth
            .getUser()
            .then(({ data: userData }) => setUser(userData.user))
            .finally(() => setLoading(false));
        const { data: authData } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null);
            }
        );
        return () => authData.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        function closeOnOutsideClick(event: MouseEvent) {
            if (menuRef.current === null) {
                return;
            }
            if (!menuRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () =>
            document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    const toggleMenu = useCallback(() => setOpen((value) => !value), []);
    const closeMenu = useCallback(() => setOpen(false), []);
    const handleSignOut = useCallback(async () => {
        await supabase.auth.signOut();
        setOpen(false);
        navigate('/');
    }, [navigate]);

    if (loading) {
        return null;
    }

    if (!user) {
        return (
            <Link
                className="justify-self-end rounded-md border border-[var(--color-border)] px-3 py-2 font-semibold text-[var(--color-primary-strong)] text-sm no-underline transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-secondary-soft)]"
                to="/login"
            >
                Iniciar sesión
            </Link>
        );
    }

    const label = user.email?.split('@')[0] ?? 'Mi cuenta';

    return (
        <div className="relative justify-self-end" ref={menuRef}>
            <button
                aria-expanded={open}
                aria-haspopup="menu"
                className="flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-2 py-1.5 font-semibold text-[var(--color-primary-strong)] text-sm transition-colors hover:border-[var(--color-border)] hover:bg-[var(--color-secondary-soft)]"
                onClick={toggleMenu}
                type="button"
            >
                <span className="grid size-7 place-items-center rounded-full bg-[var(--color-secondary)] text-[var(--color-primary-strong)]">
                    <UserIcon />
                </span>
                <span className="max-w-28 truncate">{label}</span>
                {/*<span aria-hidden="true" className="text-xs">
                    {open ? '↑' : '↓'}
                </span>*/}
            </button>
            {!!open && (
                <div
                    aria-label="Opciones de cuenta"
                    className="absolute right-0 z-20 mt-2 min-w-44 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-[0_8px_24px_rgb(76_69_65_/_16%)]"
                    role="menu"
                >
                    <Link
                        className="block rounded-md px-3 py-2 text-[var(--color-primary)] text-sm no-underline hover:bg-[var(--color-secondary-soft)]"
                        onClick={closeMenu}
                        role="menuitem"
                        to="/profile"
                    >
                        Ver perfil
                    </Link>
                    <button
                        className="block w-full cursor-pointer rounded-md bg-transparent px-3 py-2 text-left text-[var(--color-primary)] text-sm hover:bg-[var(--color-secondary-soft)]"
                        onClick={toggleTheme}
                        role="menuitem"
                        type="button"
                    >
                        cambiar tema
                    </button>
                    <button
                        className="block w-full cursor-pointer rounded-md bg-transparent px-3 py-2 text-left text-[var(--color-primary)] text-sm hover:bg-[var(--color-secondary-soft)]"
                        onClick={handleSignOut}
                        role="menuitem"
                        type="button"
                    >
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
}

export default AccountMenu;
