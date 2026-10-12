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

        const { book_key, title, cover_id } = await req.json();
        if (typeof book_key !== 'string' || !BOOK_KEY_REGEX.test(book_key)) {
            return json({ error: 'Invalid book_key' }, 400);
        }

        const { data, error } = await admin
            .from('loans')
            .insert({
                book_key,
                cover_id:
                    Number.isInteger(cover_id) && cover_id > 0
                        ? cover_id
                        : null,
                title: typeof title === 'string' ? title.slice(0, 500) : null,
                user_id: userId,
            })
            .select()
            .single();

        if (error) {
            // 23505 = unique_violation -> someone else already borrowed it
            if (error.code === '23505') {
                return json({ error: 'Book is already borrowed' }, 409);
            }
            throw error;
        }

        return json({ loan: data, ok: true }, 201);
    } catch (e) {
        return json({ error: (e as Error).message }, 500);
    }
});
