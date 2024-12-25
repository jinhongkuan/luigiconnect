import { ProjectRepository } from '$lib/db/project';

export const load = async ({ params }: { params: { projectId: string; postId?: string } }) => {
	const project = await ProjectRepository.getProject(params.projectId);
	return {
		project,
		postId: params.postId
	};
};
