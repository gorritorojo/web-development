import { createAdminClient, getUserId } from '../_shared/auth.ts';
import { corsHeaders, json } from '../_shared/cors.ts';

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const admin = createAdminClient();
        const userId = await getUserId(admin, req);
        if (!userId) {
            return json({ error: 'Not authenticated' }, 401);
        }

        const { data, error } = await admin
            .from('loans')
            .select('book_key, title, cover_id, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }
        return json({ loans: data });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
});
