<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';

    let { content } = $props();

	let editor: Editor | undefined;
	let editorElement: HTMLElement;

	onMount(() => {
		editor = new Editor({
			element: editorElement,
			extensions: [
				StarterKit
			],
			content,
			editable: false,
		});
	});

	onDestroy(() => {
		if (editor)
			editor.destroy();
	});
</script>

<div class="tiptap-viewer" bind:this={editorElement}></div>

<style>
:global(.ProseMirror) {
  height: 100%;
}

:global(.ProseMirror:focus) {
	outline: none;
	border: none;
}

:global(.tiptap-viewer) {
	flex-grow: 1;
	text-wrap: wrap;
	min-width: 0;
	overflow-wrap: break-word;
	word-break: break-word;
	font-size: 0.875rem;
	padding: 0.5rem;

	overflow: hidden;
	white-space: pre-wrap;
}
</style>