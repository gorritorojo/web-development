import type { Book } from '../api/book';

type HomeSection = {
    books: Book[];
    name: string;
};

type SearchResponse = {
    docs: Book[];
    numFound: number;
};

export type { HomeSection, SearchResponse };
