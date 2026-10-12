import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../utils/supabase';

type AuthMode = 'login' | 'signup';

function Login() {
    const navigate = useNavigate();
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setError('');
            setMessage('');
            if (password.length < 6) {
                setError('La contraseña debe tener al menos 6 caracteres');
                return;
            }

            setLoading(true);
            const result =
                mode === 'login'
                    ? await supabase.auth.signInWithPassword({
                          email,
                          password,
                      })
                    : await supabase.auth.signUp({ email, password });
            setLoading(false);

            if (result.error) {
                setError(result.error.message);
                return;
            }
            if (mode === 'signup' && !result.data.session) {
                setMessage(
                    'Cuenta creada. Revisa tu correo para confirmar el acceso'
                );
                setMode('login');
                return;
            }
            navigate('/');
        },
        [email, mode, navigate, password]
    );

    const handleEmailChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value),
        []
    );
    const handlePasswordChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) =>
            setPassword(event.target.value),
        []
    );
    const isLogin = mode === 'login';
    const toggleMode = useCallback(() => {
        setMode(isLogin ? 'signup' : 'login');
        setError('');
        setMessage('');
    }, [isLogin]);
    let submitLabel = isLogin ? 'Iniciar sesión' : 'Crear cuenta';
    if (loading) {
        submitLabel = 'Procesando…';
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-4 py-10">
            <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_8px_24px_rgb(76_69_65_/_10%)] sm:p-8">
                <h1 className="m-0 font-extrabold text-2xl text-[var(--color-primary-strong)] tracking-[-0.02em]">
                    {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                </h1>
                <p className="mt-2 mb-6 text-[var(--color-primary-muted)]">
                    {isLogin
                        ? 'Accede para continuar explorando honya'
                        : 'Guarda tu experiencia de lectura en honya'}
                </p>

                <form className="grid w-full gap-4" onSubmit={handleSubmit}>
                    <label
                        className="grid w-full gap-1.5 font-semibold text-[var(--color-primary-strong)] text-sm"
                        htmlFor="email"
                    >
                        Correo electrónico
                        <input
                            autoComplete="email"
                            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background-subtle)] px-3 py-2.5 font-normal outline-none transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-0"
                            id="email"
                            onChange={handleEmailChange}
                            required
                            type="email"
                            value={email}
                        />
                    </label>
                    <label
                        className="grid w-full gap-1.5 font-semibold text-[var(--color-primary-strong)] text-sm"
                        htmlFor="password"
                    >
                        Contraseña
                        <input
                            autoComplete={
                                isLogin ? 'current-password' : 'new-password'
                            }
                            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-background-subtle)] px-3 py-2.5 font-normal outline-none transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-0"
                            id="password"
                            minLength={6}
                            onChange={handlePasswordChange}
                            required
                            type="password"
                            value={password}
                        />
                    </label>
                    {!!error && (
                        <p
                            className="m-0 rounded-md bg-(--color-error-soft) px-3 py-2 text-[var(--color-primary-strong)] text-sm"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}
                    {!!message && (
                        <p
                            className="m-0 rounded-md bg-[var(--color-secondary-soft)] px-3 py-2 text-[var(--color-primary-strong)] text-sm"
                            role="status"
                        >
                            {message}
                        </p>
                    )}
                    <button
                        className="mt-2 cursor-pointer rounded-md bg-[var(--color-primary-strong)] px-4 py-2.5 font-bold text-[var(--color-background-subtle)] transition-colors hover:bg-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={loading}
                        type="submit"
                    >
                        {submitLabel}
                    </button>
                </form>

                <p className="mt-6 mb-0 text-[var(--color-primary-muted)] text-sm">
                    {isLogin
                        ? '¿Aún no tienes cuenta?'
                        : '¿Ya tienes una cuenta?'}{' '}
                    <button
                        className="cursor-pointer border-0 bg-transparent p-0 font-bold text-[var(--color-focus)] underline underline-offset-2"
                        onClick={toggleMode}
                        type="button"
                    >
                        {isLogin ? 'Regístrate' : 'Inicia sesión'}
                    </button>
                </p>
                <Link
                    className="mt-4 inline-block text-[var(--color-primary-muted)] text-sm hover:text-[var(--color-primary-strong)]"
                    to="/"
                >
                    Volver al catálogo
                </Link>
            </div>
        </main>
    );
}

export default Login;
