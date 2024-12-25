<script lang="ts">
	import Feed from '$lib/components/feed.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { invalidateAll } from '$app/navigation';

	const { data } = $props();

	let currentPage = data.page;
	let posts = $state(data.posts);
	let loading = false;

	async function loadMore() {
		if (loading) return;
		loading = true;

		currentPage++;
		const url = new URL(window.location.href);
		url.searchParams.set('page', currentPage.toString());
		window.history.replaceState({}, '', url.toString());

		await invalidateAll();
		const newData = $state(data);
		posts = [...posts, ...newData.posts];
		loading = false;
	}
</script>

<div class="m-4 flex gap-2">
	<Textarea
		placeholder="I am passionate about the use of technology to improve education outcomes...

I am a recent software engineering grad looking to learn more about the health industry..."
	/>
	<div class="flex flex-col gap-2">
		<Button>Find matches</Button>
		<Button href="/post" variant="outline">Create post</Button>
	</div>
</div>
<Separator class="my-4" />
<Feed {posts} onScrollEnd={loadMore} />
