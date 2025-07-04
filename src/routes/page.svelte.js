import { leftSidebarVisible, rightSidebarVisible, currentContent } from './stores';
export const contentCache = {};
export const prototypeRoot = '/html';

export let prototypeItems = [];

import { onMount } from 'svelte';

export function loadPrototypeItems() {
	onMount(async () => {
		try {
			console.log('Loading prototype items from:', prototypeRoot);
			const modules = import.meta.glob('/html/*.html', { eager: true });
			const files = Object.keys(modules);
			console.log('Found prototype files:', files);

			prototypeItems = files.map((filePath) => {
				const file = filePath.split('/').pop();
				return {
					id: file.replace('.html', ''),
					name: file,
					path: filePath
				};
			});
		} catch (error) {
			console.error('Failed to load prototype items:', error);
			// Fallback to default items if dynamic loading fails
			prototypeItems = [{ id: 'index', name: 'index.html', path: `${prototypeRoot}/index.html` }];
		}
	});
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
