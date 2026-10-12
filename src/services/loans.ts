import type { BookLoan, BookStatus } from '../types/app/loan-types.ts';
import supabase from '../utils/supabase.ts';

async function getBookStatus(bookKey: string): Promise<BookStatus> {
    const { data, error } = await supabase.functions.invoke('book-status', {
        body: { book_key: bookKey },
        timeout: 10_000,
    });

    if (error) {
        throw error;
    }

    return data;
}

async function borrowBook(bookKey: string, title: string, coverId?: number) {
    const { error } = await supabase.functions.invoke('borrow-book', {
        body: { book_key: bookKey, cover_id: coverId, title },
        timeout: 15_000,
    });

    if (error) {
        throw error;
    }
}

async function returnBook(bookKey: string) {
    const { error } = await supabase.functions.invoke('return-book', {
        body: { book_key: bookKey },
        timeout: 15_000,
    });

    if (error) {
        throw error;
    }
}

async function getMyLoans(): Promise<BookLoan[]> {
    const { data, error } = await supabase.functions.invoke('my-loans');

    if (error) {
        throw error;
    }

    const loans = Array.isArray(data) ? data : data?.loans;
    if (!Array.isArray(loans)) {
        throw new Error('Unexpected response from my-loans');
    }

    return loans;
}

export { borrowBook, getBookStatus, getMyLoans, returnBook };
