import { PrismaClient } from '@prisma/client';
import type { User } from '$lib/domain/user';

export class UserRepository {
	private static prisma: PrismaClient = new PrismaClient();
	static findByGoogleId(googleId: string) {
		return this.prisma.user.findUnique({
			where: {
				googleId
			}
		});
	}

	static create(googleId: string, name: string, email: string) {
		return this.prisma.user.create({
			data: {
				googleId,
				name,
				email
			}
		});
	}

	static async getSession(sessionId: string) {
		const payload = await this.prisma.session.findUnique({
			where: {
				id: sessionId
			},
			include: {
				user: true
			}
		});

		if (!payload) return null;

		return {
			user: payload.user as User,
			expiresAt: payload.expiresAt
		};
	}

	static updateSession(sessionId: string, expiresAt: Date) {
		return this.prisma.session.update({
			where: { id: sessionId },
			data: { expiresAt }
		});
	}

	static deleteSession(sessionId: string) {
		return this.prisma.session.delete({
			where: { id: sessionId }
		});
	}

	static deleteSessionByUserId(userId: string) {
		return this.prisma.session.deleteMany({
			where: { userId }
		});
	}

	static createSession(sessionId: string, userId: string, duration: number) {
		return this.prisma.session.create({
			data: { userId, id: sessionId, expiresAt: new Date(Date.now() + duration) }
		});
	}
}
