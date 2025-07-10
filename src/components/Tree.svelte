<script lang="ts">
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

<ul class="tree">
  {#each nodes as node}
    {#if node.children && node.children.length > 0}
      <li>
        <div class="tree-node">
          <button 
            class="toggle" 
            on:click={() => toggleExpand(node.path)}
            aria-expanded={isExpanded(node.path)}
          >
            {isExpanded(node.path) ? '−' : '+'}
          </button>
          <span class="folder">{node.name}</span>
        </div>
        {#if isExpanded(node.path)}
          <div class="tree-children">
            <ul class="tree">
              {#each node.children as child}
                <!-- 递归调用自身 -->
                {#if child.children && child.children.length > 0}
                  <li>
                    <div class="tree-node">
                      <button 
                        class="toggle" 
                        on:click={() => toggleExpand(child.path)}
                        aria-expanded={isExpanded(child.path)}
                      >
                        {isExpanded(child.path) ? '−' : '+'}
                      </button>
                      <span class="folder">{child.name}</span>
                    </div>
                    {#if isExpanded(child.path)}
                      <div class="tree-children">
                        <ul class="tree">
                          {#each child.children as grandchild}
                            {#if grandchild.children && grandchild.children.length > 0}
                              <li>
                                <div class="tree-node">
                                  <button 
                                    class="toggle" 
                                    on:click={() => toggleExpand(grandchild.path)}
                                    aria-expanded={isExpanded(grandchild.path)}
                                  >
                                    {isExpanded(grandchild.path) ? '−' : '+'}
                                  </button>
                                  <span class="folder">{grandchild.name}</span>
                                </div>
                                {#if isExpanded(grandchild.path)}
                                  <div class="tree-children">
                                    <ul class="tree">
                                      {#each grandchild.children as gggchild}
                                        {#if gggchild.children && gggchild.children.length > 0}
                                          <!-- 继续递归... 可继续复制结构，或用递归组件优化 -->
                                          <li>
                                            <div class="tree-node">
                                              <button 
                                                class="toggle" 
                                                on:click={() => toggleExpand(gggchild.path)}
                                                aria-expanded={isExpanded(gggchild.path)}
                                              >
                                                {isExpanded(gggchild.path) ? '−' : '+'}
                                              </button>
                                              <span class="folder">{gggchild.name}</span>
                                            </div>
                                            {#if isExpanded(gggchild.path)}
                                              <div class="tree-children">
                                                <ul class="tree">
                                                  {#each gggchild.children as ggggchild}
                                                    {#if ggggchild.children && ggggchild.children.length > 0}
                                                      <!-- 你可以继续递归... -->
                                                    {:else}
                                                      <li>
                                                        <div class="tree-item">
                                                          <button 
                                                            class="nav-item" 
                                                            on:click={() => onItemClick(ggggchild.path)}
                                                          >
                                                            {ggggchild.navName || ggggchild.name}
                                                          </button>
                                                        </div>
                                                      </li>
                                                    {/if}
                                                  {/each}
                                                </ul>
                                              </div>
                                            {/if}
                                          </li>
                                        {:else}
                                          <li>
                                            <div class="tree-item">
                                              <button 
                                                class="nav-item" 
                                                on:click={() => onItemClick(gggchild.path)}
                                              >
                                                {gggchild.navName || gggchild.name}
                                              </button>
                                            </div>
                                          </li>
                                        {/if}
                                      {/each}
                                    </ul>
                                  </div>
                                {/if}
                              </li>
                            {:else}
                              <li>
                                <div class="tree-item">
                                  <button 
                                    class="nav-item" 
                                    on:click={() => onItemClick(grandchild.path)}
                                  >
                                    {grandchild.navName || grandchild.name}
                                  </button>
                                </div>
                              </li>
                            {/if}
                          {/each}
                        </ul>
                      </div>
                    {/if}
                  </li>
                {:else}
                  <li>
                    <div class="tree-item">
                      <button 
                        class="nav-item" 
                        on:click={() => onItemClick(child.path)}
                      >
                        {child.navName || child.name}
                      </button>
                    </div>
                  </li>
                {/if}
              {/each}
            </ul>
          </div>
        {/if}
      </li>
    {:else}
      <li>
        <div class="tree-item">
          <button 
            class="nav-item" 
            on:click={() => onItemClick(node.path)}
          >
            {node.navName || node.name}
          </button>
        </div>
      </li>
    {/if}
  {/each}
</ul>

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
  }
  
  .folder {
    font-weight: bold;
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
  
  .tree-children.hidden {
    display: none;
  }
</style>