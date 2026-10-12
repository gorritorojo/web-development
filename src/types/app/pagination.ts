import type { PaginationLimits } from '../api/pagination';

type PaginationContextType = {
    pagination: PaginationLimits | null;
    setPagination: React.Dispatch<
        React.SetStateAction<PaginationLimits | null>
    >;
};

export type { PaginationContextType };
