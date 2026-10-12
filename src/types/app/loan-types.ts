type BookStatus = {
    available: boolean;
    borrowed_by_me: boolean;
};

type BookLoan = {
    book_key: string;
    title: string | null;
    cover_id: number | null;
    created_at: string;
};

export type { BookLoan, BookStatus };
