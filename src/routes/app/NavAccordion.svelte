<script lang="ts">
    import type { Module } from '$lib/server/db';
	import { page } from '$app/state';
	import Self from './NavAccordion.svelte';
    import 'iconify-icon';

    let { project } = $props();

    let isExpanded = $state(false);
    let children = $state<Module[]>([]);
    let loading = $state(true);
	const isActive = page.url.pathname === `/app/${project.id}`;

    async function toggleExpand() {
		isExpanded = !isExpanded;

		if (isExpanded && loading)
			try {
				const response = await fetch(`/api/app/${project.id}/children`);
				const result = await response.json();
				console.log("Result", result);
				children = result.data || [];
			} catch (error) {
				children = [];
			} finally {
				loading = false;
			}
    }
</script>

<li>
    <a href="/app/{project.id}" class="nav-item" class:active={isActive}>
        <button onclick={toggleExpand} aria-label={isExpanded ? 'Collapse' : 'Expand'}>
            <iconify-icon icon="bi:chevron-{isExpanded ? 'down' : 'right'}"></iconify-icon>
        </button>
		<span>{project.title}</span>
    </a>

	{#if isExpanded}
		<ul>
			{#if loading}
				<small>
					<iconify-icon icon="line-md:loading-loop" width="24" height="24"></iconify-icon>Loading...
				</small>
			{:else if children.length === 0}
				<small>
					No modules inside
				</small>
			{:else}
				{#each children as child (child.id)}
					<Self project={child} />
				{/each}
			{/if}
		</ul>
	{/if}
</li>

<style lang="postcss">
	button {
		display: flex;
		align-items: center;
	}

	ul {
		margin-left: 1.6rem;
		border-left: 1px solid var(--color-text-3);
		border-bottom-left-radius: 10px;
	}

	small {
		padding: 0 0 0.2rem 1rem;
		font-size: 0.9rem;
		color: var(--color-text-muted);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>