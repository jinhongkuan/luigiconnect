import { PrismaClient } from '@prisma/client';
import type { Project, ProjectPost } from '$lib/domain/user';
import { model, pinecone } from '$lib/server/pinecone';

export class ProjectRepository {
	private static prisma: PrismaClient = new PrismaClient();

	static createProject(ownerId: string) {
		return this.prisma.project.create({
			data: {
				ownerId: ownerId
			}
		});
	}

	static async getProject(projectId: string) {
		return (await this.prisma.project.findUnique({
			where: { id: projectId },
			include: {
				projectPosts: true,
				owner: true,
				collaborators: true
			}
		})) as Project;
	}

	static async createPost(
		projectPost: Omit<ProjectPost, 'id' | 'createdAt' | 'updatedAt' | 'projectId'> & {
			projectId?: string;
		}
	) {
		if (!projectPost.projectId) {
			const project = await this.createProject(projectPost.userId);
			projectPost.projectId = project.id;
		}
		const post = await this.prisma.projectPost.create({
			data: {
				title: projectPost.title,
				motivation: projectPost.motivation,
				content: projectPost.content,
				projectId: projectPost.projectId,
				companyId: projectPost.companyId,
				userId: projectPost.userId
			}
		});

		const index = pinecone.index('luigi-connect');
		const embedding = await pinecone.inference.embed(
			model,
			[`Motivation: ${projectPost.motivation} Content: ${projectPost.content}`],
			{ inputType: 'query' }
		);

		if (!embedding[0].values) {
			throw new Error('Embedding failed');
		}

		await index.namespace('project-posts').upsert([{ id: post.id, values: embedding[0].values }]);

		return post;
	}

	static async queryPosts(count: number, query?: string) {
		if (!query) {
			const total = await this.prisma.projectPost.count();
			const projectPosts = await this.prisma.projectPost.findMany({
				...(count ? { take: count } : {}),
				orderBy: {
					createdAt: 'desc'
				}
			});
			return projectPosts.map((post) => post as ProjectPost);
		}
		const index = pinecone.index('luigi-connect');
		const queryEmbedding = await pinecone.inference.embed(model, [query], { inputType: 'query' });

		if (!queryEmbedding[0].values) {
			throw new Error('Query embedding failed');
		}

		const queryResponse = await index.namespace('project-posts').query({
			topK: count,
			includeMetadata: true,
			includeValues: true,
			vector: queryEmbedding[0].values
		});

		const matches = queryResponse.matches.map((match) => match.id);
		const posts = await this.prisma.projectPost.findMany({
			where: { id: { in: matches } }
		});

		return posts.map((post) => post as ProjectPost);
	}
}
