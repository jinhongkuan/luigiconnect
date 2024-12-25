import type { PageServerLoad } from './$types';
import { ProjectRepository } from '$lib/db/project';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 0;
	const pageSize = 10;

	const posts = await ProjectRepository.queryPosts(page * pageSize);

	console.log('posts', posts);
	return {
		posts,
		page
	};
};
