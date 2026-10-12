import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export function createAdminClient() {
	return createClient(
		Deno.env.get("SUPABASE_URL")!,
		Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
	);
}

export const BOOK_KEY_REGEX = /^\/works\/OL\d+W$/;

/** Returns the authenticated user id, or null if missing/invalid token. */
export async function getUserId(
	admin: ReturnType<typeof createAdminClient>,
	req: Request,
): Promise<string | null> {
	const authHeader = req.headers.get("Authorization");
	if (!authHeader) return null;
	const { data, error } = await admin.auth.getUser(
		authHeader.replace("Bearer ", ""),
	);
	if (error || !data.user) return null;
	return data.user.id;
}
