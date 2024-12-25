export type User = {
	id: string;
	googleId: string;
	name: string;
	email: string;
	picture?: string;
};

export type ProjectPost = {
	id: string;
	projectId: string;
	userId: string;
	title: string;
	motivation: string;
	companyId?: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
};

export type Project = {
	id: string;
	owner: User;
	collaborators: User[];
	projectPosts: ProjectPost[];
};

export type Comment = {
	id: string;
	userId: string;
	projectPostId: string;
	upvotes: number;
	content: string;
	createdAt: Date;
};

export type Company = {
	id: string;
	name: string;
	description: string;
};

export type JobPosting = {
	id: string;
	title: string;
	description: string;
	link: string;
	userId: string;
	userRoleClaimTrustFactor: number;
	createdAt: Date;
	updatedAt: Date;
};
