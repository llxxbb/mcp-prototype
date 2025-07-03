<script lang="ts">
  let leftSidebarVisible = $state(true);
  let rightSidebarVisible = $state(true);
  let currentContent = $state('');
  const contentCache = $state<Record<string, string>>({});
  const prototypeRoot = import.meta.env.MCP_PROTOTYPE_ROOT;
  console.log('Prototype root:', prototypeRoot);
  
  const prototypeItems = [
    { id: 'index', name: 'Main Prototype', path: `${prototypeRoot}/index.html` },
    { id: 'style', name: 'CSS Style', path: `${prototypeRoot}/css/style.css` },
    { id: 'app', name: 'JavaScript', path: `${prototypeRoot}/js/app.js` }
  ];
  
  function toggleLeftSidebar() {
    leftSidebarVisible = !leftSidebarVisible;
  }
  
  function toggleRightSidebar() {
    rightSidebarVisible = !rightSidebarVisible;
  }
  
  async function loadContent(path: string) {
    if (contentCache[path]) {
      currentContent = contentCache[path];
      return;
    }
    
    try {
      const response = await fetch(path);
      const content = await response.text();
      contentCache[path] = content;
      currentContent = content;
    } catch (error) {
      console.error('Failed to load content:', error);
      currentContent = `Error loading content from ${path}`;
    }
  }
</script>

<main class="app-container">
  <aside class="sidebar left" class:collapsed={!leftSidebarVisible}>
    <button onclick={toggleLeftSidebar} class="toggle-btn">
      {leftSidebarVisible ? '◀' : '▶'}
    </button>
    <div class="nav-content">
      <h2>Prototype Files</h2>
      <ul>
        {#each prototypeItems as item}
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
    {#if currentContent}
      <div class="content-viewer">
        <pre>{currentContent}</pre>
      </div>
    {:else}
      <h1>mcp-prototype</h1>
      <p>Please select a prototype file from the left sidebar</p>
    {/if}
  </section>
  
  <aside class="sidebar right" class:collapsed={!rightSidebarVisible}>
    <button onclick={toggleRightSidebar} class="toggle-btn">
      {rightSidebarVisible ? '◀' : '▶'}
    </button>
    <div class="helper-content">
      <h2>Helper</h2>
      <!-- Helper content will go here -->
    </div>
  </aside>
</main>

<style>
  .app-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }
  
  .sidebar {
    width: 250px;
    background: #f5f5f5;
    transition: width 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .sidebar.collapsed {
    width: 40px;
  }
  
  .toggle-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    z-index: 10;
  }
  
  .content {
    flex: 1;
    padding: 20px;
    overflow: auto;
  }
  
  .nav-content, .helper-content {
    padding: 20px;
    width: 250px;
  }
</style>