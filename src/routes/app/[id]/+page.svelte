<script lang="ts">
	import { enhance } from '$app/forms';
  	import { invalidate, invalidateAll } from '$app/navigation';
	import Popover from '$lib/components/Popover.svelte';
	import type { PageData } from './$types';
	import CardPage from './CardPage.svelte';
	import CollectionPage from './CollectionPage.svelte';
	import ProjectPage from './ProjectPage.svelte';
	import Tag from '$lib/components/Tag.svelte';
	import 'iconify-icon';
	import Card from '$lib/components/Card.svelte';

	let { data }: { data: PageData} = $props();
	let {
		currentModule, currentModuleError,
		childModules, childModulesError,
		breadcrumbs, breadcrumbsError,
		tags, tagsError
	} = $derived(data);

	let cardPopoverId = $state('');
	let activeModule = $derived(childModules?.find(child => child.id === cardPopoverId) ?? currentModule);

	$effect(() => console.log("Current", activeModule));

	let cardPopoverTrigger = $state<any>(null);
	let showCardPopover = $state(false);

	let showCreateNewPopover = $state(false);
	let createNewTrigger = $state<HTMLElement | null>(null);

	let showTagsPopover = $state(false);
	let tagsTrigger = $state<HTMLElement | null>(null);

	let Page = $derived((() => {
		switch (currentModule?.type) {
			case 'card': return CardPage;
			case 'collection': return CollectionPage;
			case 'project': return ProjectPage;
		}
	})());
  	let displayMode = $state('row');

	async function handleUpdateTitle(updatedTitle: string) {
		if (!currentModule) return;

		const response = await fetch(`/api/app/${currentModule.id}/save`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: updatedTitle })
		});	
		
		invalidateAll();
		const { error } = await response.json();

		if (error)
			console.error('Error saving content:', error);
	}

	function openCardPopover(id: string, event: MouseEvent) {
		event.stopPropagation();
  		event.preventDefault();
		cardPopoverId = id;
		cardPopoverTrigger = event.currentTarget;
		showCardPopover = true;
	}

</script>

<header>
	<nav>
		<ul>
			{#if !currentModule}
				<li>
					<a href="/app">Go Back Home</a>
					<span class="error">{currentModuleError}</span>
				</li>
			{:else}
				{#if !breadcrumbs}
					<li>
						<span class="error">{breadcrumbsError}</span>
					</li>
				{:else}
					{#each breadcrumbs as crumb}
						<li>
							<a href="/app/{crumb.id}">{crumb.title}</a>
						</li>
					{/each}
					{#if breadcrumbsError}
						<li>Trail is botched</li>
					{/if}
				{/if}
			{/if}
		</ul>
	</nav>
	<div id="display-options">
		<input type="radio" id="layout-vertical" name="page-layout" value="column" bind:group={displayMode}>
		<label for="layout-vertical"><iconify-icon style="transform: rotate(180deg);" icon="fluent:panel-top-gallery-16-regular"></iconify-icon></label>
		
		<input type="radio" id="layout-horizontal" name="page-layout" value="row" checked bind:group={displayMode}>
		<label for="layout-horizontal"><iconify-icon icon="fluent:panel-right-gallery-16-regular"></iconify-icon></label>
	</div>

	<div id="action-options">
		<button><iconify-icon icon="material-symbols:star-outline"></iconify-icon></button>
		<button><iconify-icon icon="tabler:dots"></iconify-icon></button>
	</div>
</header>

{#if currentModuleError}
  <div class="error">{currentModuleError}</div>
{:else}

<div id="content-wrapper" data-display={displayMode} style="flex-direction: {displayMode};">
	{#if !currentModule}
		<h1 class="error">
			<span class="error">{currentModuleError}</span>
		</h1>
	{:else}
	<Page
		{...data}
		handleTitleUpdate={handleUpdateTitle}
		openCardPopover={openCardPopover}
		cardPopoverId={cardPopoverId}
		bind:showCreateNewPopover={showCreateNewPopover}
		bind:createNewTrigger={createNewTrigger}
		displayMode={displayMode}
	/>
	<Popover
		bind:isOpen={showCardPopover}
		triggerElement={cardPopoverTrigger}
		placement="bottom-end"
		onClose={() => showCardPopover = false}
	>
		<button bind:this={tagsTrigger} class="popover-options" onclick={e => showTagsPopover = true}>
			<iconify-icon icon="tabler:tags"></iconify-icon>
			<div>Manage Tags</div>
		</button>
		<form
			method="POST"
			action="/actions/modules/{cardPopoverId}?/duplicateModule"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					showCardPopover = false;
				};
			}}
		>
			<button type="submit" class="popover-options">
				<iconify-icon icon="humbleicons:duplicate"></iconify-icon>
				<div>Duplicate</div>
				<span>Ctrl+D</span>
			</button>
		</form>
		<form
			method="POST"
			action="/actions/modules/{cardPopoverId}?/deleteModule"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					showCardPopover = false;
				};
			}}
		>
			<button type="submit" class="popover-options">
				<iconify-icon icon="material-symbols:delete-outline-rounded"></iconify-icon>
				<div>Delete</div>
				<span>Del</span>
			</button>
		</form>
	</Popover>

	<Popover
		bind:isOpen={showCreateNewPopover}
		triggerElement={createNewTrigger}
		placement="bottom-end"
		onClose={() => showCreateNewPopover = false}
	>
		<div class="popover-header">Create a new...</div>
		<form
			method="POST"
			action="/actions/modules/{currentModule.id}?/createNewCard"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					showCreateNewPopover = false;
					console.log(data.childModules);
				};
			}}
		>
			<input type="hidden" name="projectId" value={currentModule.projectId} />
			<button type="submit" class="popover-options">
				<iconify-icon icon="material-symbols:article-outline-rounded"></iconify-icon>
				<div>Card</div>
				<span>1</span>
			</button>
		</form>
		<form
			method="POST"
			action="/actions/modules/{currentModule.id}?/createNewCollection"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					showCreateNewPopover = false;
				};
			}}
		>
			<input type="hidden" name="projectId" value={currentModule.projectId} />
			<button type="submit" class="popover-options">
				<iconify-icon icon="material-symbols:note-stack-outline"></iconify-icon>
				<div>Collection</div>
				<span>2</span>
			</button>
		</form>
	</Popover>

	<Popover
		bind:isOpen={showTagsPopover}
		triggerElement={tagsTrigger}
		placement="right-center"
		onClose={() => showTagsPopover = false}
	>
		<div class="popover-header">Manage tags...</div>
		{#if !tags || tagsError}
			<span class="error">{tagsError}</span>
		{:else}
			{#each tags as tag (tag.id)}
				{#if activeModule?.tags?.some(tagItem => tagItem.id === tag.id)}
					<form
						method="POST"
						action="/actions/modules/{activeModule.id}/tags/{tag.id}?/removeTag"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
							};
						}}
					>
						<button type="submit" class="popover-options">
							<Tag id={tag.id} name={tag.name} color={tag.color} />
						</button>
					</form>
				{:else}
					<form
						method="POST"
						action="/actions/modules/{activeModule.id}/tags/{tag.id}?/addTag"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
							};
						}}
					>
						<button type="submit" class="popover-options">
							<Tag id={tag.id} name={tag.name} color={tag.color} />
						</button>
					</form>
				{/if}
			{/each}
		{/if}
	</Popover>
	{/if}
</div>
{/if}
<style>
	#content-wrapper {
		flex-grow: 1;
		display: flex;
		width: 100%;
		height: 100%;
		padding: 2rem;

		:global(&[data-display="row"] #resizer) {
			height: 100%;	
			width: 4px;
			margin: 0 0.8rem;
			cursor: col-resize;
		}

		:global(&[data-display="column"] #resizer) {
			width: 100%;
			height: 4px;
			margin: 0.8rem 0;
			cursor: row-resize;
		}
	}

	:global(#content-wrapper #resizer) {
		background-color: transparent;
		border: none;

		&:hover {
			background-color: var(--color-resizer);
		}
	}

	header {
		height: 3%;
		font-size: 1.3rem;
		margin: 0.5rem 1rem;
		display: flex;
		justify-content: space-between;

		ul {
			padding: 0;
			margin: 0;
			list-style: none;
		}

		li {
			display: inline;
		}

		li + li::before {
			content: '/';
			padding: 0 0.5rem;
			color: gray;
		}

		a {
			text-decoration: none;
			color: var(--color-text-2);
		}
	}

	#display-options, #action-options {
		display: flex;
	}

	input[type="radio"] {
		display: none;
	}

	#display-options label {
		display: flex;
		align-items: center;
		padding: 0.2rem 2rem;
		border-radius: 1rem;
		font-size: 2rem;
		color: var(--color-text-1);
		transition: all 0.2s ease-in-out;
		cursor: pointer;
	}

	#action-options button {
		display: flex;
		align-items: center;
		background-color: transparent;
		border: none;
		padding: 0.2rem 0.4rem;
		border-radius: 0.5rem;
		font-size: 2rem;
		color: var(--color-text-1);
		transition: all 0.2s ease-in-out;
		cursor: pointer;
	}

	label:hover, #action-options button:hover,
	input[type="radio"]:checked + label {
		color: var(--color-text-0);
		background-color: var(--color-bg-3);
	}

	.popover-header {
		color: var(--color-text-2);		
		font-size: 0.9rem;
		font-weight: bold;
		padding: 0.1rem 0.5rem;
	}

	.popover-options {
		width: 100%;
		color: var(--color-text-1);
		padding: 0.2rem 0.5rem;
		background-color: transparent;
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		gap: 5px;
		border: none;
		cursor: pointer;
		border-radius: 5px;

		&:hover {
			background-color: var(--color-bg-3);
		}

		div {
			flex-grow: 1;
			text-align: left;
		}

		span {
			font-size: 0.9rem;
			color: var(--color-text-3)
		}
	}

	:global(.tiptap) {
		flex-grow: 1;
		margin: 0;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}
</style>


