<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import type { ProjectPost } from '$lib/domain/user';
	export let post: ProjectPost;
</script>

<Card.Root {...$$restProps} class="w-full">
	<Card.Content class="p-6">
		<h2 class=" font-semibold">{post.title}</h2>
		<Separator class="my-4" />
		<div class="prose">
			<p>{post.motivation}</p>
		</div>
		<Separator class="my-4" />
		<p>{post.content}</p>
	</Card.Content>
</Card.Root>
