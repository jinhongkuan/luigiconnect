<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Combobox from '$lib/components/ui/combobox/index.svelte';
	import Button from '../ui/button/button.svelte';
	import { enhance } from '$app/forms';
	import PostProject from './post/project.svelte';

	let postTypes = [
		{ prefix: 'Share', value: 'project', label: 'Project' },
		{ prefix: 'Comment on', value: 'company', label: 'Company' },
		{ prefix: 'Share', value: 'job', label: 'Job Posting' }
	];

	let prefix = $state('Share');
	let postType = $state('project');
	let formData = {
		title: '',
		motivation: '',
		content: ''
	};

	function updatePrefix(value: string) {
		prefix = postTypes.find((f) => f.value === value)?.prefix ?? '';
		postType = value;
	}

	function handleSubmit(event: SubmitEvent) {
		console.log('Form submitted', formData);
	}
</script>

<Card.Root class="m-6 h-fit w-full">
	<form
		method="POST"
		use:enhance={() => {
			return async ({ update }) => {
				await update();
			};
		}}
		on:submit|preventDefault={handleSubmit}
	>
		<Card.Header>
			<Card.Title>
				{prefix}
				<Combobox options={postTypes} onSelect={updatePrefix} initialValue="project" />
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<input type="hidden" name="type" value={postType} />
			<PostProject bind:formData />
			<Button type="submit">Publish</Button>
		</Card.Content>
	</form>
</Card.Root>
