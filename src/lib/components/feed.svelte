<script lang="ts">
	import type { ProjectPost } from '$lib/domain/user';
	import { onMount } from 'svelte';
	import PostCard from './post-card.svelte';
	import { goto } from '$app/navigation';

	export let posts: ProjectPost[] = [];
	export let onScrollEnd: () => Promise<void>;

	let feedContainer: HTMLElement;
	let loading = false;

	async function handleScroll() {
		if (loading) return;

		const { scrollTop, scrollHeight, clientHeight } = feedContainer;
		const scrollPosition = scrollTop + clientHeight;

		// Check if user has scrolled to bottom (with 100px threshold)
		if (scrollHeight - scrollPosition < 100) {
			loading = true;
			try {
				await onScrollEnd();
			} finally {
				loading = false;
			}
		}
	}

	onMount(() => {
		feedContainer.addEventListener('scroll', handleScroll);
		return () => {
			feedContainer.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div bind:this={feedContainer} class="h-full overflow-y-auto">
	{#if posts.length === 0}
		<div class="p-4 text-center text-gray-500">No posts yet</div>
	{:else}
		{#each posts as post (post.id)}
			<PostCard
				{post}
				onClick={() => {
					goto(`/project/${post.projectId}/${post.id}`);
				}}
			/>
		{/each}
	{/if}

	{#if loading}
		<div class="p-4 text-center text-gray-500">Loading more posts...</div>
	{/if}
</div>
