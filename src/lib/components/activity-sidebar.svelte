<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Sidebar.Root side="right">
	<Sidebar.Header />
	<Sidebar.Content>
		<Sidebar.Group />
		<Sidebar.Group />
	</Sidebar.Content>
	<Sidebar.Footer>
		<Button>Our Thesis</Button>
	</Sidebar.Footer>
</Sidebar.Root>
