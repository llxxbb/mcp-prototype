<script lang="ts">
  import TreeNode from './TreeNode.svelte';
  export let items: {relativePath: string; navName: string}[];
  export let onItemClick: (path: string) => void;
  
  let expandedNodes = new Map<string, boolean>();
  $: console.log('Expanded nodes:', Array.from(expandedNodes.entries()));

  function buildTree(items?: {relativePath: string; navName: string}[]) {
    const root = [];
    const pathMap = new Map();

    if (!items || !Array.isArray(items)) return root;

    items.forEach(item => {
      const parts = item.relativePath.split('/');
      let currentLevel = root;
      let currentPath = '';

      parts.forEach((part, index) => {
        currentPath = currentPath ? currentPath + '/' + part : part;
        let node = pathMap.get(currentPath);

        if (!node) {
          node = {
            path: currentPath,
            name: part,
            children: [],
            isLeaf: index === parts.length - 1,
            navName: index === parts.length - 1 ? item.navName : undefined
          };
          pathMap.set(currentPath, node);
          currentLevel.push(node);
        }
        currentLevel = node.children;
      });
    });

    return root;
  }

  $: nodes = buildTree(items);
  $: {
    // Debug only the first level to avoid recursion
    if (nodes.length > 0) {
      const debugNode = {
        path: nodes[0].path,
        name: nodes[0].name,
        children: nodes[0].children?.length || 0
      };
      console.log('Root node:', debugNode);
    }
  }

  function toggleExpand(node: string) {
    const currentState = expandedNodes.get(node) || false;
    expandedNodes = new Map(expandedNodes);
    expandedNodes.set(node, !currentState);
    console.log('Toggled node:', node, 'New state:', !currentState);
    nodes = [...nodes]; // Force reactivity update
  }

  function isExpanded(node: string): boolean {
    return expandedNodes.get(node) || false;
  }
</script>

<!-- 引入递归组件 -->
<ul class="tree">
  {#each nodes as node}
    <TreeNode
      node={node}
      {onItemClick}
      {toggleExpand}
      {isExpanded}
    />
  {/each}
</ul>

<style>
  .tree {
    list-style: none;
    padding-left: 1rem;
    margin: 0;
  }
</style>