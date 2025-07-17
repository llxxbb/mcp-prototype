<script lang="ts">
	import Tree from '../components/Tree.svelte';
	import { toggleLeftSidebar, toggleRightSidebar, loadContent } from './page.svelte.js';
	import { onMount, onDestroy } from 'svelte';
	import {
		leftSidebarVisible,
		rightSidebarVisible,
		currentContentUrl,
		currentContentHelp
	} from './stores';
	import { marked } from 'marked';

	export let data;
	let prototypeItems = data?.prototypeItems || [];
	let isPanelDragging = false;
	let panelPosition = { x: 0, y: 20 };
	let dragStart = { x: 0, y: 0 };

	onMount(() => {
		// Set initial position to top-right corner but within visible area
		panelPosition.x = window.innerWidth - 130; // 100 (width) + 30 buffer
	});

	function handleDragStart(event) {
		isPanelDragging = true;
		dragStart.x = event.clientX - panelPosition.x;
		dragStart.y = event.clientY - panelPosition.y;
		event.preventDefault(); // Prevent default drag behavior
	}

	function handleDragMove(event) {
		if (isPanelDragging) {
			const newX = event.clientX - dragStart.x;
			const newY = event.clientY - dragStart.y;

			// Calculate boundaries
			const maxX = window.innerWidth - 100; // panel width
			const maxY = window.innerHeight - 50; // panel height

			// Allow full horizontal movement
			panelPosition.x = Math.max(0, Math.min(newX, maxX)); // increased range
			panelPosition.y = Math.max(0, Math.min(newY, maxY));
		}
	}

	function handleDragEnd() {
		isPanelDragging = false;
	}

	// Manage drag event listeners
	if (typeof window !== 'undefined') {
		const moveListener = (event) => handleDragMove(event);
		const upListener = () => handleDragEnd();

		// Add listeners on component mount
		onMount(() => {
			document.addEventListener('mousemove', moveListener);
			document.addEventListener('mouseup', upListener);
		});

		// Remove listeners on component destroy
		onDestroy(() => {
			document.removeEventListener('mousemove', moveListener);
			document.removeEventListener('mouseup', upListener);
		});
	}
</script>

<main class="app-container">
	<div id="toolbox" class="draggable-panel" role="button" tabindex="0" style="transform: translate({panelPosition.x}px, {panelPosition.y}px);">
		<button onclick={toggleLeftSidebar} class="toggle-btn">
			{$leftSidebarVisible ? '◀' : '▶'}
		</button>
		<button onclick={toggleRightSidebar} class="toggle-btn">
			{$rightSidebarVisible ? '◀' : '▶'}
		</button>
		<div id="drag-handler" class="drag-handle" onmousedown={handleDragStart} role="presentation">☰</div>
	</div>
	<aside class="sidebar" class:collapsed={!$leftSidebarVisible}>
		<div class="nav-content">
			<h2>Prototype Files: {prototypeItems.length}</h2>
			<Tree items={prototypeItems} onItemClick={loadContent} />
		</div>
	</aside>

	<section class="content">
		{#if $currentContentUrl !== ''}
			<div class="content-viewer">
				<iframe
					title="prototype page"
					src={$currentContentUrl}
					frameborder="0"
					class="content-frame"
				></iframe>
			</div>
		{:else}
			<h1>mcp-prototype</h1>
			<p>Please select a prototype file from the left sidebar</p>
		{/if}
	</section>

	<aside class="sidebar right" class:collapsed={!$rightSidebarVisible}>
		<div class="helper-content">
			<h2>Helper</h2>
			<div class="helper-content">
				{#if $currentContentHelp}
					{@html marked($currentContentHelp)}
				{:else}
					<p>No help available</p>
				{/if}
			</div>
		</div>
	</aside>
</main>

<style global>
	@import './page.svelte.css';
	
</style>
