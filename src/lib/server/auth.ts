// src/lib/server/auth.ts
import { dev } from '$app/environment';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { PrismaClient, type User } from '@prisma/client';
import { Lucia } from 'lucia';

export const db = new PrismaClient();

const adapter = new PrismaAdapter(db.session, db.user); // your adapter

export const lucia = new Lucia(adapter, {
	getUserAttributes: (attributes) => {
		return {
			isAdmin: (attributes as User).isAdmin
		};
	},
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
	}
}
