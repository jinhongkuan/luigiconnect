<script lang="ts">
	import { Textarea } from '$lib/components/ui/textarea';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Input } from '$lib/components/ui/input';

	export let formData = {
		title: '',
		motivation: '',
		content: ''
	};
</script>

<Input name="title" placeholder="Title" bind:value={formData.title} />
<Separator class="my-4" />

<Textarea
	name="motivation"
	placeholder="Why does it matter?"
	class="h-40"
	bind:value={formData.motivation}
/>

<Separator class="my-4" />
<Textarea
	name="content"
	placeholder="What have you been working on?"
	class="h-40"
	bind:value={formData.content}
/>
<Separator class="my-4" />
