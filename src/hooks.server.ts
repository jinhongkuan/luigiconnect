import {
	validateSessionToken,
	setSessionTokenCookie,
	deleteSessionTokenCookie
} from './lib/server/session';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session') ?? null;
	if (token === null) {
		event.locals.user = null;
		return resolve(event);
	}

	const { expiresAt, user } = await validateSessionToken(token);
	if (expiresAt !== null) {
		setSessionTokenCookie(event, token, expiresAt);
	} else {
		deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	console.log(event.locals.user);
	return resolve(event);
};
