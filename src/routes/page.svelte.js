import {
	leftSidebarVisible,
	rightSidebarVisible,
	currentContentUrl,
	currentContentHelp
} from './stores';
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
	} else {
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
	console.log('Loading content:', path);
	currentContentUrl.set(path);
	// Load corresponding markdown help content
	const helpPath = path.replace(/\.html$/, '.annotation.md');
	try {
		const helpResponse = await fetch(helpPath);
		currentContentHelp.set(await helpResponse.text());
	} catch (error) {
		currentContentHelp.set('');
		console.log(`No help markdown found for ${helpPath}`);
	}
}
