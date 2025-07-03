export let leftSidebarVisible = true;
export let rightSidebarVisible = true;
export let currentContent = '';
export const contentCache = {};
export const prototypeRoot = "html";

export let prototypeItems = [];

import { onMount } from 'svelte';

export function loadPrototypeItems() {
  onMount(async () => {
    try {
      console.log('Loading prototype items from:', prototypeRoot);
      const response = await fetch(`${prototypeRoot}/?list=html`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const files = await response.json();
      console.log('Found prototype files:', files);
      
      prototypeItems = files
        .filter((file) => file.endsWith('.html'))
        .map((file) => ({
          id: file.replace('.html', ''),
          name: file,
          path: `${prototypeRoot}/${file}`
        }));
    } catch (error) {
      console.error('Failed to load prototype items:', error);
      // Fallback to default items if dynamic loading fails
      prototypeItems = [
        { id: 'index', name: 'index.html', path: `${prototypeRoot}/index.html` }
      ];
    }
  });
}

export function toggleLeftSidebar() {
  leftSidebarVisible = !leftSidebarVisible;
}

export function toggleRightSidebar() {
  rightSidebarVisible = !rightSidebarVisible;
}

export async function loadContent(path) {
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