<script lang="ts">
	import TreeNode from './TreeNode.svelte';
	import { expandedNodes } from './treeStore';
	export let node;
	export let onItemClick: (path: string) => void;
	export let toggleExpand: (path: string) => void;
</script>

{#if node.children && node.children.length > 0}
	<li>
		<div class="tree-node">
			<button
				class="toggle"
				on:click={() => toggleExpand(node.path)}
				aria-expanded={$expandedNodes.get(node.path)}
			>
				{$expandedNodes.get(node.path) ? '📂' : '📁'}
			</button>
			<button class="folder" on:click={() => toggleExpand(node.path)}>
				{node.name}
			</button>
		</div>
		{#if $expandedNodes.get(node.path)}
			<div class="tree-children">
				<ul class="tree">
					{#each node.children as child}
						<TreeNode node={child} {onItemClick} {toggleExpand} />
					{/each}
				</ul>
			</div>
		{/if}
	</li>
{:else}
	<li>
		<div class="tree-item">
			<span class="doc-icon">📄</span>
			<button class="nav-item" on:click={() => onItemClick(node.path)}>
				{node.navName || node.name}
			</button>
		</div>
	</li>
{/if}

<style>
	.tree {
		list-style: none;
		padding-left: 1rem;
		margin: 0;
	}

	.tree-node,
	.tree-item {
		display: flex;
		align-items: center;
		padding: 0.25rem 0;
	}

	.toggle {
		background: none;
		border: none;
		cursor: pointer;
		width: 1.5rem;
		text-align: center;
		padding: 0;
		margin-right: 0.5rem;
		font-size: 1.1em;
	}

	.folder {
		font-weight: bold;
		cursor: pointer;
		user-select: none;
		outline: none;
		background: none;
		border: none;
		padding: 0;
	}
	.folder:focus {
		text-decoration: underline;
	}

	.doc-icon {
		margin-right: 0.5rem;
		font-size: 1.1em;
	}

	.nav-item {
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
		padding: 0;
	}

	.nav-item:hover {
		text-decoration: underline;
	}
</style>
