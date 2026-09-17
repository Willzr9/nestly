<script lang="ts">
    import TiptapEditor from '$lib/components/TiptapEditor.svelte';
	import { enhance } from '$app/forms';

    let { currentModule: card, handleTitleUpdate } = $props();
</script>
    <section>
        <input
            type="text"
            value={card.title}
            oninput={(e) => {
                if (e.target) handleTitleUpdate((e.target as HTMLInputElement).value);
            }}
            placeholder="Enter a title..."
        />
		{#key card.id}
        	<TiptapEditor id={card.id} content={card.body} />
		{/key}
    </section>
    <div id="right-wrapper">
    </div>

<style>
    section {
		height: 100%;
        width: 100%;
		background-color: var(--color-bg-1);
		padding: 0.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
	}

	section input {
		box-sizing: border-box;
		width: 100%;
		padding: 0.3rem;
		font-size: 2rem;
		color: var(--color-text-1);
		font-weight: 700;
		border: none;
		background-color: transparent;
	}
</style>