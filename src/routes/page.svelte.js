import { leftSidebarVisible, rightSidebarVisible, currentContent } from './stores';
export const contentCache = {};
export const prototypeRoot = '/html';

export let prototypeItems = [];

// Initialize from environment variable if available
if (typeof process !== 'undefined' && process.env.MCP_PROTOTYPE_FILES) {
    try {
        prototypeItems = JSON.parse(process.env.MCP_PROTOTYPE_FILES);
        console.log('Html files:', prototypeItems);
    } catch (error) {
        console.error('Failed to parse MCP_PROTOTYPE_FILES:', error);
    }
}



export function toggleLeftSidebar() {
	leftSidebarVisible.update((v) => !v);
}

export function toggleRightSidebar() {
	rightSidebarVisible.update((v) => !v);
}

export async function loadContent(path) {
	if (contentCache[path]) {
		currentContent.set(contentCache[path]);
		return;
	}

	try {
		const response = await fetch(path);
		const content = await response.text();
		contentCache[path] = content;
		currentContent.set(content);
	} catch (error) {
		console.error('Failed to load content:', error);
		currentContent.set(`Error loading content from ${path}`);
	}
}