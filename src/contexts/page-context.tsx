import type React from 'react';
import { createContext, useState } from 'react';
import type { PaginationLimits } from '../types/api/pagination';
import type { PaginationContextType } from '../types/app/pagination';

const PaginationContext = createContext<PaginationContextType | null>(null);

function PaginationContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [pagination, setPagination] = useState<PaginationLimits | null>({
        limit: 20,
        page: 1,
    });

    return (
        <PaginationContext value={{ pagination, setPagination }}>
            {children}
        </PaginationContext>
    );
}

export { PaginationContext, PaginationContextProvider };
