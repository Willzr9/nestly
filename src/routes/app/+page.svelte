<script lang="ts">
	import { enhance } from '$app/forms';
	import TipTapViewer from '$lib/components/TiptapViewer.svelte';
	import type { LayoutProps } from './$types';

	let { data }: LayoutProps = $props();
	let { ownedProjects, ownedError } = $derived(data);

	let filteredProjects = $derived(ownedProjects);
</script>

<header>
	Test Header
</header>

<section>
	<h1>Welcome Home</h1>

	<input
		type="text"
		placeholder="Search projects..."
		oninput={(e) => {
			const target = e.target as HTMLInputElement | null;
			if (!target) filteredProjects = ownedProjects;
			else {
				const searchTerm = target.value.toLowerCase();
				filteredProjects = ownedProjects.filter((project) =>
					project.title.toLowerCase().includes(searchTerm)
				);
			}
		}}
	/>
	<span>You own {ownedProjects.length} collections</span>
	<div>
		{#each filteredProjects as project}
			<a href="/app/{project.id}">
				<h2>{project.title}</h2>
				<TipTapViewer content={project.body} />
			</a>
		{/each}
		<form
			method="POST"
			action="/actions/modules?/createProject"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
				};
			}}
		>
			<button type="submit" class="create-project">
				<h2>Create new Project</h2>
				<p>+</p>
			</button>
		</form>
	</div>
</section>

<style>
	section {
		width: 100%;
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	h1 {
		font-size: 2.8rem;
		margin: 3rem 0 0.3rem 0;
	}

	section span {
		align-self: left;
		font-size: 1.6rem;
		color: var(--color-text-2);
		margin-bottom: 0.5rem;
	}

	div {
		width: 80%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
		gap: 0.8rem;
	}

	a {
		text-decoration: none;
		color: var(--color-text-0);
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 15rem;
		background-color: var(--color-bg-2);
		padding: 0.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.2s ease-in-out;

		h2 {
			font-size: 1.8rem;
		}
	}

	:global(a .ProseMirror) {
		padding: 0 0 0 0.5rem;

		/* display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden; */
	}

	a:hover {
		transform: scale(1.02);
	}

	button {
		height: 15rem;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		padding: 0.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	button:hover {
		background-color: var(--color-bg-0);
		transform: scale(1.02);
	}

	button h2 {
		font-size: 0.8rem;
	}

	button p {
		color: var(--color-text-2);
		font-size: 0.6rem;
	}
</style>
