import {
	BOOK_KEY_REGEX,
	createAdminClient,
	getUserId,
} from "../_shared/auth.ts";
import { corsHeaders, json } from "../_shared/cors.ts";

Deno.serve(async (req) => {
	if (req.method === "OPTIONS")
		return new Response("ok", { headers: corsHeaders });

	try {
		const { book_key } = await req.json();
		if (typeof book_key !== "string" || !BOOK_KEY_REGEX.test(book_key)) {
			return json({ error: "Invalid book_key" }, 400);
		}

		const admin = createAdminClient();
		// Auth is optional here: anonymous users can still see availability
		const userId = await getUserId(admin, req);

		const { data: loan, error } = await admin
			.from("loans")
			.select("user_id")
			.eq("book_key", book_key)
			.maybeSingle();

		if (error) throw error;

		return json({
			available: !loan,
			borrowed_by_me: !!loan && !!userId && loan.user_id === userId,
		});
	} catch (e) {
		return json({ error: (e as Error).message }, 500);
	}
});
