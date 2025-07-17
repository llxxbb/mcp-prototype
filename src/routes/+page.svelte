<script lang="ts">
	import Tree from '../components/Tree.svelte';
	import {
		toggleLeftSidebar,
		toggleRightSidebar,
		loadContent,
		dragInit,
		dragEnd,
		handleDragStart
	} from './page.svelte.js';

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
	let panelPosition = { x: 0, y: 0 };

	onMount(() =>dragInit(document));
	onDestroy(() =>dragEnd());

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
