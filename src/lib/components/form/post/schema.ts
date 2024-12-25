import { z } from 'zod';

export const projectFormSchema = z.object({
	type: z.string(),
	title: z.string().min(1, 'Title is required'),
	motivation: z.string().min(1, 'Motivation is required'),
	content: z.string().min(1, 'Content is required')
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
