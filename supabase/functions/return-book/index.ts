import {
    BOOK_KEY_REGEX,
    createAdminClient,
    getUserId,
} from '../_shared/auth.ts';
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

        const { book_key } = await req.json();
        if (typeof book_key !== 'string' || !BOOK_KEY_REGEX.test(book_key)) {
            return json({ error: 'Invalid book_key' }, 400);
        }

        const { data, error } = await admin
            .from('loans')
            .delete()
            .eq('book_key', book_key)
            .eq('user_id', userId) // only the borrower can return it
            .select();

        if (error) {
            throw error;
        }
        if (!data || data.length === 0) {
            return json({ error: 'You have not borrowed this book' }, 404);
        }

        return json({ ok: true });
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
});
