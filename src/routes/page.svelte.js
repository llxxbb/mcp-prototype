import { leftSidebarVisible, rightSidebarVisible, currentContent } from './stores';
export const contentCache = {};
export const prototypeRoot = '/html';

// Initialize from environment variable if available
export function initFiles() {
	if (typeof process !== 'undefined' && process.env.MCP_PROTOTYPE_FILES) {
		try {
			let files = JSON.parse(process.env.MCP_PROTOTYPE_FILES);
			console.log('Html files:', files);
			return files;
		} catch (error) {
			console.error('Failed to parse MCP_PROTOTYPE_FILES:', error);
		}
		return [];
	}
	else {
		console.log('MCP_PROTOTYPE_FILES not set, using default');
		return [];
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
