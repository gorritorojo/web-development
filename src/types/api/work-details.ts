type WorkDetails = {
    key: string;
    title: string;
    authors?: { author: { key: string } }[];
    covers?: number[];
    description?: { value: string } | string;
    subjects?: string[];
};

export type { WorkDetails };
