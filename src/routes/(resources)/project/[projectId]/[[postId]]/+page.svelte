<script lang="ts">
	import PostCard from '$lib/components/post-card.svelte';

	export let data;
	const { project, postId } = data;

	// Sort posts by creation date, newest first
	const sortedPosts =
		project?.projectPosts?.sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		) ?? [];
</script>

{#if !project}
	<div class="flex h-[50vh] items-center justify-center">
		<h1 class="text-4xl font-bold text-gray-500">Project no longer exists</h1>
	</div>
{:else}
	<div class="flex flex-col gap-4 p-4">
		{#each sortedPosts as post}
			<PostCard {post} class={post.id === postId ? 'border-4 border-primary' : ''} />
		{/each}
	</div>
{/if}
