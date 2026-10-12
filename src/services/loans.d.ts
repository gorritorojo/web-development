import type { BookLoan, BookStatus } from '../types/app/loan-types.ts';
declare function getBookStatus(bookKey: string): Promise<BookStatus>;
declare function borrowBook(bookKey: string, title: string, coverId?: number): Promise<void>;
declare function returnBook(bookKey: string): Promise<void>;
declare function getMyLoans(): Promise<BookLoan[]>;
export { borrowBook, getBookStatus, getMyLoans, returnBook };
