import { OPEN_LIBRARY_SUBJECTS } from '../constants/genres';
import { RESOURCES } from '../constants/openlib-resources';
import type { Book } from '../types/api/book.ts';
import type {
    HomeSection,
    SearchResponse,
} from '../types/app/home-service-types.ts';
import api from '../utils/openbook-api-client';

const PAGE_SIZE = 20;

type SubjectPage = { books: Book[]; numFound: number };

async function getBooksBySubject(
    subject: string,
    offset = 0,
    limit = PAGE_SIZE
): Promise<SubjectPage> {
    const { data } = await api.get<SearchResponse>(RESOURCES.SEARCH, {
        params: {
            fields: 'key,title,author_name,cover_i',
            limit,
            offset,
            subject,
        },
    });

    return { books: data.docs, numFound: data.numFound };
}

async function searchBooks(
    q: string,
    offset = 0,
    limit = PAGE_SIZE
): Promise<SubjectPage> {
    const { data } = await api.get<SearchResponse>(RESOURCES.SEARCH, {
        params: {
            fields: 'key,title,author_name,cover_i',
            limit,
            offset,
            q,
            sort: 'rating',
        },
    });

    return { books: data.docs, numFound: data.numFound };
}

let homeRequest: Promise<HomeSection[]> | undefined;

function loadHomeBooks() {
    if (!homeRequest) {
        const subjects = OPEN_LIBRARY_SUBJECTS.toSorted(
            () => Math.random() - 0.5
        ).slice(0, 3);
        homeRequest = Promise.all(
            subjects.map(async ({ api: subjectApi, name }) => ({
                books: (await getBooksBySubject(subjectApi)).books,
                name,
            }))
        );
    }

    return homeRequest;
}

export type { SubjectPage };
export { getBooksBySubject, loadHomeBooks, PAGE_SIZE, searchBooks };
