<script lang="ts">
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import UserSidebar from '$lib/components/user-sidebar.svelte';
	import ActivitySidebar from '$lib/components/activity-sidebar.svelte';
	let { children, data } = $props();

	let user = data.user;
</script>

<Sidebar.Provider>
	<div class="flex h-screen w-full">
		<UserSidebar {user} />
		<main class="flex-1">
			{@render children?.()}
		</main>
		<ActivitySidebar />
	</div>
</Sidebar.Provider>
