<script lang="ts">
	import Sidebar from './Sidebar.svelte';
	import '../../app.css';

	let { data, children } = $props();
</script>

<div class="app">
	<Sidebar {...data} />
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
	}

	main {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
