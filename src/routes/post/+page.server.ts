import { fail, redirect } from '@sveltejs/kit';
import { projectFormSchema } from '$lib/components/form/post/schema';
import type { Actions } from './$types';
import { ProjectRepository } from '$lib/db/project';

export const actions = {
	default: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const validatedData = projectFormSchema.parse({
				type: formData.type,
				title: formData.title,
				motivation: formData.motivation,
				content: formData.content
			});

			const post = await ProjectRepository.createPost({
				...validatedData,
				userId: locals.user.id
			});

			return redirect(303, `/project/${post.projectId}/${post.id}`);
		} catch (error) {
			console.error('Validation error:', error); // Debug log
			return fail(400, {
				error: 'Invalid form submission',
				data: formData
			});
		}
	}
} satisfies Actions;
