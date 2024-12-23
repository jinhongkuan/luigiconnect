import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';

import type { RequestEvent } from '@sveltejs/kit';
import { UserRepository } from '$lib/db/user';
import type { User } from '$lib/domain/user';

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await UserRepository.getSession(sessionId);
	if (row === null) {
		return { expiresAt: null, user: null };
	}

	if (Date.now() >= row.expiresAt.getTime()) {
		UserRepository.deleteSession(sessionId);
		return { expiresAt: null, user: null };
	}
	if (Date.now() >= row.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		row.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		UserRepository.updateSession(sessionId, row.expiresAt);
	}
	return { expiresAt: row.expiresAt, user: row.user };
}

export function invalidateSession(sessionId: string): void {
	UserRepository.deleteSession(sessionId);
}

export function invalidateUserSessions(userId: string): void {
	UserRepository.deleteSessionByUserId(userId);
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}

export function createSession(token: string, userId: string): Session {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	UserRepository.createSession(session.id, userId, 1000 * 60 * 60 * 24 * 30);
	return session;
}

export interface Session {
	id: string;
	expiresAt: Date;
	userId: string;
}

type SessionValidationResult = { expiresAt: Date; user: User } | { expiresAt: null; user: null };
