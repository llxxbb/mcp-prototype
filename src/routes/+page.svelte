<script lang="ts">
	import { toggleLeftSidebar, toggleRightSidebar, loadContent } from './page.svelte.js';
	import {
		leftSidebarVisible,
		rightSidebarVisible,
		currentContentUrl,
		currentContentHelp
	} from './stores';
	import { marked } from 'marked';

	export let data;
	let prototypeItems = data?.prototypeItems || [];
</script>

<main class="app-container">
	<aside class="sidebar left" class:collapsed={!$leftSidebarVisible}>
		<button onclick={toggleLeftSidebar} class="toggle-btn">
			{$leftSidebarVisible ? '◀' : '▶'}
		</button>
		<div class="nav-content">
			<h2>Prototype Files: {prototypeItems.length}</h2>
			<ul>
				{#each prototypeItems as item (item.relativePath)}
					<li>
						<button onclick={() => loadContent(item.relativePath)}>
							{item.navName}
						</button>
					</li>
				{/each}
			</ul>
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
		<button onclick={toggleRightSidebar} class="toggle-btn">
			{$rightSidebarVisible ? '◀' : '▶'}
		</button>
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
