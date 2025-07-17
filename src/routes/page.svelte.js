import {
	leftSidebarVisible,
	rightSidebarVisible,
	currentContentUrl,
	currentContentHelp
} from './stores';

let currentContentUrlValue;
currentContentUrl.subscribe(value => {
	currentContentUrlValue = value;
});
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
	leftSidebarVisible.update(value => !value);
}

export function toggleRightSidebar() {
	// Updated implementation to prevent right sidebar from being toggled when content is loaded
	if (!currentContentUrlValue) {
		rightSidebarVisible.update(value => !value);
	}
}

export async function loadContent(path) {
	console.log('Loading content:', path);
	currentContentUrl.set(path);
	// Load corresponding markdown help content
	const helpPath = path.replace(/\.html$/, '.annotation.md');
	try {
		const helpResponse = await fetch(helpPath);
		if (!helpResponse.ok) {
			currentContentHelp.set('');
			return;
		}
		currentContentHelp.set(await helpResponse.text());
	} catch (error) {
		currentContentHelp.set('');
		console.log(`load  help markdown error for ${helpPath}: ${error.message}`);
	}
}

// Drag logic
let isPanelDragging = false;
let panelPosition = { x: 0, y: 20 };
let dragStart = { x: 0, y: 0 };

export function handleDragStart(event) {
	isPanelDragging = true;
	dragStart.x = event.clientX - panelPosition.x;
	dragStart.y = event.clientY - panelPosition.y;
	event.preventDefault(); // Prevent default drag behavior
}

export function handleDragMove(event) {
	if (isPanelDragging) {
		const newX = event.clientX - dragStart.x;
		const newY = event.clientY - dragStart.y;

		// Calculate boundaries
		const maxX = window.innerWidth - 100; // panel width
		const maxY = window.innerHeight - 50; // panel height

		// Update position with boundary checks
		panelPosition.x = Math.max(-100, Math.min(newX, maxX));
		panelPosition.y = Math.max(0, Math.min(newY, maxY));
	}
}

export function handleDragEnd() {
	isPanelDragging = false;
}

// Drag event listeners
export function setupDragListeners() {
	const moveListener = (event) => handleDragMove(event);
	const upListener = () => handleDragEnd();

	document.addEventListener('mousemove', moveListener);
	document.addEventListener('mouseup', upListener);

	return { moveListener, upListener };
}
