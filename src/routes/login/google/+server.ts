import { generateCodeVerifier, generateState } from 'arctic';
import { google } from '$lib/server/oauth';

import type { RequestEvent } from '@sveltejs/kit';

export const GET = async (event: RequestEvent) => {
	const codeVerifier = generateCodeVerifier();
	const state = generateState();

	const redirectUrl = google.createAuthorizationURL(state, codeVerifier, [
		'openid',
		'profile',
		'email'
	]);

	event.cookies.set('google_oauth_state', state, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60, // 1 hour
		sameSite: 'lax'
	});
	event.cookies.set('google_code_verifier', codeVerifier, {
		path: '/',
		httpOnly: true,
		maxAge: 60 * 60, // 1 hour
		sameSite: 'lax'
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: redirectUrl.toString()
		}
	});
};
