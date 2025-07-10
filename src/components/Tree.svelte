<script lang="ts">
  import TreeNode from './TreeNode.svelte';
  import { expandedNodes } from './treeStore';
  export let items: {relativePath: string; navName: string}[];
  export let onItemClick: (path: string) => void;
  
  // expandedNodes 已在 store 文件中定义

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

  function getDisplayNodes() {
    const treeNodes = buildTree(items);
    if (treeNodes.length === 1 && treeNodes[0].children && treeNodes[0].children.length > 0) {
      return treeNodes[0].children;
    }
    return treeNodes;
  }

  function debugRootNode() {
    const nodes = getDisplayNodes();
    if (nodes.length > 0) {
      const debugNode = {
        path: nodes[0].path,
        name: nodes[0].name,
        children: nodes[0].children?.length || 0
      };
      console.log('Root node:', debugNode);
    }
  }

  function debugExpandedNodes() {
    expandedNodes.subscribe(val => {
      console.log('Expanded nodes:', Array.from(val.entries()));
    })();
  }

  debugExpandedNodes();
  debugRootNode();

  function toggleExpand(node: string) {
    expandedNodes.update(map => {
      const newMap = new Map(map);
      const currentState = newMap.get(node) || false;
      newMap.set(node, !currentState);
      return newMap;
    });
    debugExpandedNodes();
    debugRootNode();
  }
</script>

<!-- 引入递归组件 -->
<ul class="tree">
  {#each getDisplayNodes() as node}
    <TreeNode
      node={node}
      {onItemClick}
      {toggleExpand}
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