<script lang="ts">
	import '../../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from './Header.svelte';
    import Footer from './Footer.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<Header session={data.session} />
	<main>
		{@render children?.()}
	</main>
    <Footer />
</div>

<style lang="postcss">
	.app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }

    main {
        flex-grow: 1;
        width: 100%;
        justify-content: center;
        display: flex;
    }
</style>