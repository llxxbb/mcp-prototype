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
		ads
	} from './stores';
	import { marked } from 'marked';
	import { adService } from '../lib/adService';
	import Advertisement from '../components/Advertisement.svelte';

	export let data;
	const prototypeItems = data?.prototypeItems || [];

	onMount(async () => {
		dragInit(document);
		
		// 加载广告数据
		try {
			const adsData = await adService.getAds();
			ads.set(adsData);
		} catch (error) {
			console.error('Failed to load ads:', error);
		}
	});
	onDestroy(() => dragEnd());
</script>

<main class="app-container">
	<div id="toolbox" class="draggable-panel">
		<button onclick={toggleLeftSidebar} class="toggle-btn">
			<img src={$leftSidebarVisible ? svgNav1 : svgNav2} alt="toggle left sidebar" />
		</button>
		<button onclick={toggleRightSidebar} class="toggle-btn">
			<img src={$rightSidebarVisible ? svgPen1 : svgPen2} alt="toggle right sidebar" />
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
		{#if $ads[0]}
			<Advertisement ad={$ads[0]} />
		{/if}
		<!-- Advertisement slot 2 -->
		{#if $ads[1]}
			<Advertisement ad={$ads[1]} />
		{/if}
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
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html marked($currentContentHelp)}
				{:else}
					<p>No help available</p>
				{/if}
			</div>
		</div>
		<!-- Advertisement slot 3 -->
		{#if $ads[2]}
			<Advertisement ad={$ads[2]} />
		{/if}
		<!-- Advertisement slot 4 -->
		{#if $ads[3]}
			<Advertisement ad={$ads[3]} />
		{/if}
	</aside>
</main>

<style global>
	@import './page.svelte.css';
</style>
