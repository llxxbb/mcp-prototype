<script lang="ts">
  import TreeNode from './TreeNode.svelte';
  export let node;
  export let onItemClick: (path: string) => void;
  export let toggleExpand: (path: string) => void;
  export let isExpanded: (path: string) => boolean;
</script>

<style>
  .tree {
    list-style: none;
    padding-left: 1rem;
    margin: 0;
  }
  
  .tree-node, .tree-item {
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

{#if node.children && node.children.length > 0}
  <li>
    <div class="tree-node">
      <button
        class="toggle"
        on:click={() => toggleExpand(node.path)}
        aria-expanded={isExpanded(node.path)}
      >
        {isExpanded(node.path) ? '📂' : '📁'}
      </button>
      <span class="folder">{node.name}</span>
    </div>
    {#if isExpanded(node.path)}
      <div class="tree-children">
        <ul class="tree">
          {#each node.children as child}
            <TreeNode
              node={child}
              {onItemClick}
              {toggleExpand}
              {isExpanded}
            />
          {/each}
        </ul>
      </div>
    {/if}
  </li>
{:else}
  <li>
    <div class="tree-item">
      <span class="doc-icon">📄</span>
      <button
        class="nav-item"
        on:click={() => onItemClick(node.path)}
      >
        {node.navName || node.name}
      </button>
    </div>
  </li>
{/if} 