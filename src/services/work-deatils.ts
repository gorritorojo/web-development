import type { WorkDetails } from '../types/api/work-details.ts';
import api from '../utils/openbook-api-client';

async function getWorkDetails(workId: string): Promise<WorkDetails> {
    const { data } = await api.get<WorkDetails>(`/works/${workId}.json`);
    return data;
}

export { getWorkDetails };
