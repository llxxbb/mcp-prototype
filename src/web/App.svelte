<script>
  export let name;
  
  let leftSidebarVisible = true;
  let rightSidebarVisible = true;
  
  function toggleLeftSidebar() {
    leftSidebarVisible = !leftSidebarVisible;
  }
  
  function toggleRightSidebar() {
    rightSidebarVisible = !rightSidebarVisible;
  }
</script>

<main class="app-container">
  <aside class="sidebar left" class:collapsed={!leftSidebarVisible}>
    <button on:click={toggleLeftSidebar} class="toggle-btn">
      {leftSidebarVisible ? '◀' : '▶'}
    </button>
    <div class="nav-content">
      <h2>Navigation</h2>
      <!-- Navigation items will go here -->
    </div>
  </aside>
  
  <section class="content">
    <h1>Hello {name}!</h1>
    <p>Prototype content will be loaded here</p>
  </section>
  
  <aside class="sidebar right" class:collapsed={!rightSidebarVisible}>
    <button on:click={toggleRightSidebar} class="toggle-btn">
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