import type { RequestEvent } from '@sveltejs/kit';

export const GET = async (event: RequestEvent) => {
	// Clear all cookies

	event.cookies.delete('session', { path: '/' });

	// Redirect to home page
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
};
