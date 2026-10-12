import { useEffect, useState } from 'react';
import { getWorkDetails } from '../services/work-deatils';
import type { WorkDetails } from '../types/api/work-details.ts';

type State =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'done'; data: WorkDetails };

function useWorkDetails(workId: string) {
    const [state, setState] = useState<State>({ status: 'loading' });

    useEffect(() => {
        let active = true;
        setState({ status: 'loading' });

        getWorkDetails(workId)
            .then((data) => {
                if (active) {
                    setState({ data, status: 'done' });
                }
            })
            .catch(() => {
                if (active) {
                    setState({
                        message: 'Could not load book details',
                        status: 'error',
                    });
                }
            });

        return () => {
            active = false;
        };
    }, [workId]);

    return state;
}

export { useWorkDetails };
