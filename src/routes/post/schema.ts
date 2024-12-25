import { z } from 'zod';

export const projectSchema = z.object({
	title: z.string().min(1),
	motivation: z.string().min(1),
	content: z.string().min(1)
});
