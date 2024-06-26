import { z } from 'zod';

export const ProductFormSchema = z.object({
	name: z.string().min(3, 'Too short'),
	priceInCents: z.number({ coerce: true }),
	description: z.string().min(5, 'Too short'),
	file: z.instanceof(File, { message: 'Upload a file' }).refine((f) => f.size > 0, 'Required'),
	image: z
		.instanceof(File)
		.refine((f) => f.size > 0 && f.size < 100000, 'Image size should between 1-100KB')
		.refine((f) => f.type.startsWith('image/'), 'Wrong format')
});

export const UserFormSchema = z.object({
	username: z.string().min(3, 'Too short'),
	email: z.string().email(),
	isAdmin: z.boolean().default(false)
});
export const ProfileFormSchema = z.object({
	username: z.string().min(3, 'Too short'),
	email: z.string().email(),
	password: z.string().min(3)
});

export const LoginFormSchema = z.object({
	username: z.string().min(3),
	password: z.string().min(3)
});
export const SignupFormSchema = z.object({
	email: z.string().email(),
	username: z.string().min(3),
	password: z.string().min(3)
});
