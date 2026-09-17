<script lang="ts">
	import { page } from '$app/stores';
	import NavAccordion from './NavAccordion.svelte';
	import 'iconify-icon';

	let { ownedProjects, sharedProjects } = $props();

	let isResizing = $state(false);
	let isCollapsed = $state(false);
	let sidebarWidth = $state(300);
	let startX: number;
	let startWidth: number;
  	let previousWidth = 250;

	function startResize(event: MouseEvent) {
		isResizing = true;

		startX = event.clientX;
		startWidth = sidebarWidth;
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
		document.body.style.cursor = 'col-resize';
	}

	function resize(event: MouseEvent) {
		if (!isResizing) return;

		const deltaX = event.clientX - startX;
		const newWidth = startWidth + deltaX;
		sidebarWidth = Math.max(200, Math.min(600, newWidth));;
	}

	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		document.body.style.cursor = '';
	}

	function toggleCollapse() {
		if (isCollapsed) {
		// Expand: restore previous width
			sidebarWidth = previousWidth;
			isCollapsed = false;
		} else {
		// Collapse: save current width and collapse
			previousWidth = sidebarWidth;
			sidebarWidth = 0;
			isCollapsed = true;
		}
	}
</script>

<nav class:is-collapsed={isCollapsed} style="width: {sidebarWidth}px; transition: {isResizing ? 'none' : 'width 0.6s ease;'}">
	<header>
		<div class="nav-item" id="account"></div>

		<ul>
			<li>
				<button class="nav-item">
					<iconify-icon icon="bi:search" width="24" height="24"></iconify-icon>
					<span>Search</span>
				</button>
			</li>
			<li>
				<a class="nav-item" id="home" href="/app" class:active={$page.url.pathname === '/app'}>
					<iconify-icon icon="bi:house" width="24" height="24"></iconify-icon>
					<span>Home</span>
				</a>
			</li>
		</ul>
	</header>

	<main>
		<section>
			<h2>Owned</h2>
			<ul>
				{#each ownedProjects as project}
					<NavAccordion {project} />
				{/each}	
			</ul>
		</section>
		<section>
			<h2>Shared</h2>
			<ul>
				{#each sharedProjects as project}
					<NavAccordion {project} />
				{/each}	
			</ul>
		</section>
	</main>

	<footer>
		<ul>
			<li>
				<a class="nav-item" id="settings" href="./#settings" class:active={$page.url.pathname === '/app/#settings'}>
					<iconify-icon icon="bi:gear" width="24" height="24"></iconify-icon>
					<span>Settings</span>
				</a>
			</li>
			<li>
				<a class="nav-item" id="settings" href="./#settings" class:active={$page.url.pathname === '/app/#settings'}>
					<iconify-icon icon="bi:trash" width="24" height="24"></iconify-icon>
					<span>Trash</span>
				</a>
			</li>
		</ul>
	</footer>
	<button id="resizer" onmousedown={startResize} aria-label="Resize sidebar"></button>
	<button
		id="collapse-button"
		onclick={toggleCollapse}
		title="Collapse Sidebar"
		aria-label="Collapse Sidebar"
	>
		<iconify-icon icon="bi:chevron-double-{isCollapsed ? 'right' : 'left'}" width="24" height="24"></iconify-icon>
	</button>


</nav>

<style>
	nav {
		display: flex;
		flex-direction: column;
		position: relative;
		height: 100dvh;
		width: 200px;
		font-size: 0.875rem;
		color: rgb(204, 204, 204);
		background-color: var(--color-bg-1);
		z-index: 1000;
		border-right: 1px solid var(--color-resizer);

		&:hover {
			border-color: var(--color-resizer-hover);
		}

		&.is-collapsed #collapse-button {
			left: 0;
		}
	}

	header {
		overflow: hidden;
	}

	main {
		flex-grow: 1;
		overflow: hidden;

		section {
			margin: 1.5rem 0;
			
			h2 {
				padding: 0 1rem;
				text-transform: uppercase;
				letter-spacing: 0.8px;
				font-weight: 600;
				font-size: 0.9rem;
				color: var(--color-text-2)
			}
		}		
	}

	ul {
		margin: 0 1rem;
	}

	footer {
		padding: 0.6rem 0;
		border-top: 1px solid var(--color-resizer);
	}

	#resizer {
		position: absolute;
		top: 0;
		right: 0;
		border: none;
		width: 2px;
		height: 100%;
		cursor: ew-resize;

		&:hover {
			background-color: var(--color-resizer);
		}
	}

	:global(.nav-item) {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.7rem;
		border-radius: 10px;
		color: var(--color-text-2);
		font-size: 1.2rem;
		font-weight: 500;
		padding: 0.3rem 1rem;
		transition: all 0.2s ease-in-out;
	}

	:global(.nav-item span) {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	:global(.nav-item.active, .nav-item:hover) {
		background-color: var(--color-bg-3);
		color: var(--color-text-0);
	}
	
	#collapse-button {
		position: absolute;
		top: 0;
		right: 0;
		width: fit-content;
		font-size: 2.2rem;
		color: var(--color-text-2);
		cursor: pointer;
		margin: 0.4rem;
		padding: 0.1rem 0.4rem;
		transition: all 0.2s ease;

		&:hover {
			background-color: var(--color-bg-3);
			color: var(--color-text-0);
			border-radius: 4px;
		}
	}
</style>
