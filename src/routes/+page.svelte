<script lang="ts">
	import {
		prototypeItems,
		loadPrototypeItems,
		toggleLeftSidebar,
		toggleRightSidebar,
		loadContent
	} from './page.svelte.js';
	import {
		leftSidebarVisible,
		rightSidebarVisible,
		currentContent
	} from './stores';

	loadPrototypeItems();
</script>

<main class="app-container">
	<aside class="sidebar left" class:collapsed={!$leftSidebarVisible}>
		<button onclick={toggleLeftSidebar} class="toggle-btn">
			{$leftSidebarVisible ? '◀' : '▶'}
		</button>
		<div class="nav-content">
			<h2>Prototype Files</h2>
			<ul>
				{#each prototypeItems as item (item.path)}
					<li>
						<button onclick={() => loadContent(item.path)}>
							{item.name}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</aside>

	<section class="content">
		{#if $currentContent}
			<div class="content-viewer">
				<iframe title="prototype page" srcdoc={$currentContent} frameborder="0" class="content-frame"
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
			<!-- Helper content will go here -->
		</div>
	</aside>
</main>

<style global>
	@import './page.svelte.css';
</style>