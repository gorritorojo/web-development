import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay = 1000): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}

export { useDebounce };
