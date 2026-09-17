<script lang="ts">
    import TiptapEditor from '$lib/components/TiptapEditor.svelte';
	import Card from '$lib/components/Card.svelte';
	import { enhance } from '$app/forms';

    let { currentModule: collection, childModules, childModulesError, handleTitleUpdate, openCardPopover, cardPopoverId, showCreateNewPopover = $bindable(), createNewTrigger = $bindable(), displayMode } = $props();

	let isRowLayout = $derived(displayMode === 'row');
	let isResizing = $state(false);
	let startPos: number;
	let startSize: number;
	let section: HTMLElement;
	let sectionSize = $state(300);
	let parentContainerSize = $state(0);

	$effect(() => {
		if (section) {
			const parentContainer = section.parentElement || document.body;
			parentContainerSize = isRowLayout ? parentContainer.offsetWidth : parentContainer.offsetHeight;
			sectionSize = parentContainerSize * 0.3;
		}
	})

	function startResize(event: MouseEvent) {
		isResizing = true;

		startPos = isRowLayout ? event.clientX : event.clientY;
		startSize = sectionSize;
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
		document.body.style.cursor = isRowLayout ? 'col-resize' : 'row-resize';
	}

	function resize(event: MouseEvent) {
        if (!isResizing) return;

        const currentPos = isRowLayout ? event.clientX : event.clientY;
        console.log(section.offsetWidth, parentContainerSize);
        const delta = (currentPos - startPos);
		sectionSize = Math.max(200, Math.min(500, startSize + delta));
	}

	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		document.body.style.cursor = '';
	}
</script>

    <section bind:this={section} style="{isRowLayout ? "width" : "height"}: {sectionSize}px;">
        <input
            type="text"
            value={collection.title}
            oninput={(e) => {
                if (e.target) handleTitleUpdate((e.target as HTMLInputElement).value);
            }}
            placeholder="Enter a title..."
        />
    	{#key collection.id}
        	<TiptapEditor id={collection.id} content={collection.body} />
		{/key}
    </section>
	<button id="resizer" onmousedown={startResize} aria-label="Resize Page"></button>
    <div id="right-wrapper">
        <header id="toolbar">
            <div id="display-options">
                <input type="radio" id="size-small" name="page-display" value="small">
                <label for="size-small"><iconify-icon icon="mdi:size-s"></iconify-icon></label>
                
                <input type="radio" id="size-medium" name="page-display" value="medium" checked>
                <label for="size-medium"><iconify-icon icon="mdi:size-m"></iconify-icon></label>
                
                <input type="radio" id="size-large" name="page-display" value="large">
                <label for="size-large"><iconify-icon icon="mdi:size-l"></iconify-icon></label>
            </div>
            <div id="action-options">
                <button><iconify-icon icon="material-symbols-light:filter-list"></iconify-icon></button>
                <button><iconify-icon icon="material-symbols-light:search"></iconify-icon></button>
				<button onclick={() => showCreateNewPopover = true} bind:this={createNewTrigger}><iconify-icon icon="material-symbols-light:add-circle-outline"></iconify-icon></button>
            </div>
        </header>
        <nav>
            {#if !childModules}
                <span class="error">{childModulesError}</span>
            {:else}
                {#if childModules.length === 0}
                    <p class="error">No child modules found</p>
                {:else}
                    {#each childModules as childModule (childModule.id)}
                        <Card id={childModule.id} title={childModule.title} body={childModule.body} openCardPopover={openCardPopover} isSelected={cardPopoverId === childModule.id} tags={childModule.tags}/>
                    {/each}		
                {/if}	
            {/if}
        </nav>
    </div>

<style>
    section {
		height: 100%;
		background-color: var(--color-bg-2);
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
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

	#right-wrapper {
		height: 100%;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	#toolbar {
		background-color: rgba(127, 255, 212, 0);
		display: flex;
		justify-content: space-between;
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

	#right-wrapper:has(input[value="small"]:checked) {
		--card-size: 8rem;
	}

	#right-wrapper:has(input[value="medium"]:checked) {
		--card-size: 12rem;
	}

	#right-wrapper:has(input[value="large"]:checked) {
    	--card-size: 16rem;
	}

	div nav {
		height: 0;
		flex-grow: 1;
		display: grid;
		/* grid-template-columns: 1fr 1fr 1fr;
		grid-template-rows: 1fr 1fr 1fr; */
		grid-template-columns: repeat(auto-fill, minmax(calc(var(--card-size) + 2rem), 1fr));
    	grid-template-rows: repeat(auto-fill, minmax(var(--card-size), 1fr));
		gap: 0.8rem;
		overflow-y: scroll;
		overflow-x: hidden
	}

	::-webkit-scrollbar {
		width: 10px;      
	}

	::-webkit-scrollbar-thumb {
		background: var(--color-bg-4);   
		border-radius: 6px;    
	}

	::-webkit-scrollbar-track {
		background: transparent; 
	}

::-webkit-scrollbar-button:single-button:vertical:decrement {
    height: 12px;
    width: 16px;
    background-position: center 4px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(96, 96, 96)'><polygon points='50,00 0,50 100,50'/></svg>");
}

::-webkit-scrollbar-button:single-button:vertical:decrement:hover {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(112, 112, 112)'><polygon points='50,00 0,50 100,50'/></svg>");
}

::-webkit-scrollbar-button:single-button:vertical:decrement:active {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(128, 128, 128)'><polygon points='50,00 0,50 100,50'/></svg>");
}

/* Down */
::-webkit-scrollbar-button:single-button:vertical:increment {
    height: 12px;
    width: 16px;
    background-position: center 2px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(96, 96, 96)'><polygon points='0,0 100,0 50,50'/></svg>");
}

::-webkit-scrollbar-button:single-button:vertical:increment:hover {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(112, 112, 112)'><polygon points='0,0 100,0 50,50'/></svg>");
}

::-webkit-scrollbar-button:single-button:vertical:increment:active {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(128, 128, 128)'><polygon points='0,0 100,0 50,50'/></svg>");
}
</style>