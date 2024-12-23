import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/session';
import { google } from '$lib/server/oauth';
import { decodeIdToken } from 'arctic';
import { z } from 'zod';

import type { RequestEvent } from '@sveltejs/kit';
import type { OAuth2Tokens } from 'arctic';
import { UserRepository } from '$lib/db/user';

const googleUserSchema = z.object({
	sub: z.string(),
	name: z.string(),
	email: z.string()
});

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('google_oauth_state') ?? null;
	const codeVerifier = event.cookies.get('google_code_verifier') ?? null;
	if (code === null || state === null || storedState === null || codeVerifier === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await google.validateAuthorizationCode(code, codeVerifier);
	} catch (error) {
		// Invalid code or client credentials
		return new Response(
			`Invalid code or client credentials: ${error instanceof Error ? error.message : 'Unknown error'}`,
			{
				status: 400
			}
		);
	}
	const claims = decodeIdToken(tokens.idToken());
	const googleUser = googleUserSchema.parse(claims);

	// TODO: Replace this with your own DB query.
	const existingUser = await UserRepository.findByGoogleId(googleUser.sub);

	if (existingUser !== null) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}

	// TODO: Replace this with your own DB query.
	const user = await UserRepository.create(googleUser.sub, googleUser.name, googleUser.email);

	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
