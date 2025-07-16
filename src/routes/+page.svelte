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
	let panelPosition = { x: 20, y: 20 };
	let dragStart = { x: 0, y: 0 };

	function handleDragStart(event) {
		isPanelDragging = true;
		dragStart.x = event.clientX - panelPosition.x;
		dragStart.y = event.clientY - panelPosition.y;
	}

	function handleDragMove(event) {
		if (isPanelDragging) {
			const newX = event.clientX - dragStart.x;
			const newY = event.clientY - dragStart.y;
			// Ensure the panel stays within the viewport
			const maxX = window.innerWidth - 100; // panel width
			const maxY = window.innerHeight - 50; // panel height
			panelPosition.x = Math.max(0, Math.min(newX, maxX));
			panelPosition.y = Math.max(0, Math.min(newY, maxY));
		}
	}

	function handleDragEnd() {
		isPanelDragging = false;
	}

	$: {
		// Only add event listeners when the component is active
		if (typeof window !== 'undefined') {
			const moveListener = (event) => handleDragMove(event);
			const upListener = () => handleDragEnd();

			document.addEventListener('mousemove', moveListener);
			document.addEventListener('mouseup', upListener);

			// Cleanup function to remove event listeners when component is destroyed
			onDestroy(() => {
				document.removeEventListener('mousemove', moveListener);
				document.removeEventListener('mouseup', upListener);
			});
		}
	}
</script>

<main class="app-container">
	<div class="draggable-panel" style="left: {panelPosition.x}px; top: {panelPosition.y}px;" role="button" tabindex="0">
		<button onclick={toggleLeftSidebar} class="toggle-btn sidebar-toggle-btn">
			{$leftSidebarVisible ? '◀' : '▶'}
		</button>
		<button onclick={toggleRightSidebar} class="toggle-btn sidebar-toggle-btn">
			{$rightSidebarVisible ? '◀' : '▶'}
		</button>
		<div class="drag-handle" onmousedown={handleDragStart} role="presentation">☰</div>
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
			<div class="markdown-content">
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
