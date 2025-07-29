<script lang="ts">
	import svgNav1 from '$img/nav-1.svg';
	import svgNav2 from '$img/nav-2.svg';
	import svgPen1 from '$img/pen-1.svg';
	import svgPen2 from '$img/pen-2.svg';
	import svgDir from '$img/dir.svg';
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
		currentContentHelp,
		panelPosition
	} from './stores';
	import { marked } from 'marked';

	export let data;
	let prototypeItems = data?.prototypeItems || [];

	onMount(() =>dragInit(document));
	onDestroy(() =>dragEnd());

</script>

<main class="app-container">
	<div id="toolbox" class="draggable-panel">
		<button onclick={toggleLeftSidebar} class="toggle-btn">
			<img
				src={$leftSidebarVisible ? svgNav1 : svgNav2}
				alt="toggle left sidebar"
			/>
		</button>
		<button onclick={toggleRightSidebar} class="toggle-btn">
			<img
				src={$rightSidebarVisible ? svgPen1 : svgPen2}
				alt="toggle right sidebar"
			/>
		</button>
		<div id="drag-handler" class="drag-handle" onmousedown={handleDragStart} role="presentation">
			<img src={svgDir} alt="drag handle" />
		</div>
	</div>
	<aside class="sidebar" style="display: {$leftSidebarVisible ? 'block' : 'none'}">
		<div class="nav-content">
			<h2>Prototype Files: {prototypeItems.length}</h2>
			<Tree items={prototypeItems} onItemClick={loadContent} />
		</div>
		<!-- Advertisement slot 1 -->
		<div class="advertisement-slot">
			<div class="ad-label">广告</div>
			<div class="ad-content">
				<a href="https://beta.publishers.adsterra.com/referral/MMkdJQZHGc" rel="nofollow"><img alt="banner" src="https://landings-cdn.adsterratech.com/referralBanners/png/200%20x%20200%20px.png" /></a>
			</div>
		</div>
		<!-- Advertisement slot 2 -->
		<div class="advertisement-slot">
			<div class="ad-label">广告</div>
			<div class="ad-content">
				<!-- Advertisement content goes here -->
			</div>
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

	<aside class="sidebar right" style="display: {$rightSidebarVisible ? 'block' : 'none'}">
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
		<!-- Advertisement slot 3 -->
		<div class="advertisement-slot">
			<div class="ad-label">广告</div>
			<div class="ad-content">
				<!-- Advertisement content goes here -->
			</div>
		</div>
		<!-- Advertisement slot 4 -->
		<div class="advertisement-slot">
			<div class="ad-label">广告</div>
			<div class="ad-content">
				<!-- Advertisement content goes here -->
			</div>
		</div>
	</aside>
</main>

<style global>
	@import './page.svelte.css';
	
</style>