import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './app.tsx';
import { PaginationContextProvider } from './contexts/page-context.tsx';
import { ThemeProvider } from './contexts/theme-context.tsx';
import BookDetailsLayout from './layouts/book-details-layout.tsx';
import MainLayout from './layouts/main-layout.tsx';
import BookDetails from './pages/book-details.tsx';
import Genre from './pages/genre.tsx';
import Login from './pages/login.tsx';
import Profile from './pages/profile.tsx';
import Search from './pages/search.tsx';

createRoot(document.getElementById('root') as HTMLElement).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <PaginationContextProvider>
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route element={<App />} path="/" />
                            <Route element={<App />} path="/home" />
                            <Route element={<Genre />} path="/genre/:subject" />
                            <Route element={<Search />} path="/search" />
                        </Route>
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<BookDetailsLayout />}>
                            <Route
                                element={<BookDetails />}
                                path="/books/:bookId"
                            />
                        </Route>
                    </Routes>
                </PaginationContextProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
);
