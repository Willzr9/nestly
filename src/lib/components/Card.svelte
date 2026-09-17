<script lang="ts">
	import TipTapViewer from '$lib/components/TiptapViewer.svelte';
    import Tag from '$lib/components/Tag.svelte';
	import { onDestroy } from 'svelte';

    let { id, title, body, openCardPopover, isSelected, tags } = $props();

</script>

<a href="./{id}" class:selected={isSelected}>
    <h2>{title}</h2>
    <TipTapViewer content={body} />
    <footer>
        <div id="tag-list">
            {#each tags as tag}
                <Tag id={tag.id} name={tag.name} color={tag.color} />
            {/each}
        </div>
        <button id="edit-button" onclick={e => openCardPopover(id, e)}>
            <iconify-icon icon="tabler:dots"></iconify-icon>
        </button>
    </footer>
    
    <div class="overlay-heavy"></div>
</a>

<style>
a {
    position: relative;
    overflow: hidden;
    border: none;
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg-2);
    text-decoration: none;
    border-radius: 0.5rem;
    box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    
    &:hover {
        filter: brightness(1.2);
    }
}

a.selected {
    filter: brightness(1.6) !important;
}

h2 {
    background-color: var(--color-bg-1);
    border: 1px solid var(--color-bg-2);
    padding: 0.5rem;
    font-size: 1em;
}

#edit-button {
    height: fit-content;
    opacity: 0;
    display: flex;
    align-items: center;
    background-color: var(--color-bg-1);
    border-radius: 0.5rem;
    font-size: 1.2rem;
    padding: 0.2rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.2) ;
    transition: all 0.2s ease-in-out;
    z-index: 100;

    &:hover {
        filter: brightness(1.2);        
    }

}

a:hover #edit-button {
    opacity: 100%;
}


footer {
    display: flex;
    height: fit-content;
    width: 100%;
    padding: 6px;
    bottom: 0;
    z-index: 10;
}

#tag-list {
    flex-grow: 1;
    display: flex;
}

.overlay-heavy {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 160px;
    background: linear-gradient(
        to top,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 100%
    );
}

.overlay-heavy::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0.2) 30%,
        transparent 100%
    );
}

:global(.tiptap-viewer) {
    overflow-y: hidden;
}

</style>