<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import FloatingMenu from '@tiptap/extension-floating-menu';
	import 'iconify-icon';

  	export let content: any;
	export let id: string;

	let editor: Editor | undefined;
	let editorElement: HTMLElement;
	let floatingMenuElement: HTMLElement;
	let saveTimeout: ReturnType<typeof setTimeout>;

	async function save(content: any) {
		const response = await fetch(`/api/app/${id}/save`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ body: content })
		});
		const { data, error } = await response.json();

		if (error)
			console.error('Error saving content:', error);
	}

	onMount(() => {
		editor = new Editor({
			element: editorElement,
			extensions: [
				StarterKit,
				FloatingMenu
			],
			content,
            onUpdate: ({ editor }) => {
				const json = editor.getJSON();
				clearTimeout(saveTimeout);
				saveTimeout = setTimeout(() => save(json), 500);
            }
		});
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

<div class="floating-menu" bind:this={floatingMenuElement}>
	<button aria-label="Bold" on:click={() => editor!.chain().focus().toggleBold().run()} class:active={editor ? editor.isActive('bold') : false}><iconify-icon icon="bi:type-bold"></iconify-icon></button>
	<button aria-label="Italic" on:click={() => editor!.chain().focus().toggleItalic().run()}><iconify-icon icon="bi:type-italic"></iconify-icon></button>
	<button aria-label="Underline" on:click={() => editor!.chain().focus().toggleUnderline().run()}><iconify-icon icon="bi:type-underline"></iconify-icon></button>
	<button aria-label="Strikethrough" on:click={() => editor!.chain().focus().toggleStrike().run()}><iconify-icon icon="bi:type-strikethrough"></iconify-icon></button>
</div>

<div class="tiptap-editor" bind:this={editorElement}></div>

<style>
:global(.ProseMirror:focus) {
	outline: none;
	border: none;
}

.floating-menu {
	display: flex;
	border-radius: 5px;
	background-color: var(--color-bg-1);
}
button {
	background-color: transparent;
	border: none;
	cursor: pointer;
	aspect-ratio: 1;
	font-size: 2rem;
	box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
	transition: all 0.2s ease-in-out;

    &:hover {
	    background-color: var(--color-bg-2);
    }
}

button.active i {
	background-color: aqua;
	color: rgb(29, 84, 235);
}

:global(.tiptap-editor) {
    flex-grow: 1;
    text-wrap: wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
}
</style>