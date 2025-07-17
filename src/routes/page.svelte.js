import {
	leftSidebarVisible,
	rightSidebarVisible,
	currentContentUrl,
	currentContentHelp
} from './stores';

let currentContentUrlValue;
currentContentUrl.subscribe((value) => {
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
	leftSidebarVisible.update((value) => !value);
}

export function toggleRightSidebar() {
	// Updated implementation to prevent right sidebar from being toggled when content is loaded
	if (!currentContentUrlValue) {
		rightSidebarVisible.update((value) => !value);
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

export function dragInit(doc) {
	dragDoc = doc;
	// Set initial position to top-right corner but within visible area
	panelPosition.x = window.innerWidth - 130; // 100 (width) + 30 buffer
}

export async function dragEnd() {
	if (dragDoc) {
		dragDoc.removeEventListener('mousemove', moveListener);
		dragDoc.removeEventListener('mouseup', upListener);
	}
}

export function handleDragStart(event) {
	isPanelDragging = true;
	dragStart.x = event.clientX - panelPosition.x;
	dragStart.y = event.clientY - panelPosition.y;
	event.preventDefault(); // Prevent default drag behavior
}

let dragDoc;
const moveListener = (event) => handleDragMove(event);
const upListener = () => handleDragEnd();


let isPanelDragging = false;
let panelPosition = { x: 0, y: 0 };
let dragStart = { x: 0, y: 0 };

function handleDragMove(event) {
	if (!isPanelDragging) {
		return;
	}
	const newX = event.clientX - dragStart.x;
	const newY = event.clientY - dragStart.y;

	// Calculate boundaries
	const maxX = window.innerWidth - 100; // panel width
	const maxY = window.innerHeight - 50; // panel height

	// Allow full horizontal movement
	panelPosition.x = Math.max(0, Math.min(newX, maxX)); // increased range
	panelPosition.y = Math.max(0, Math.min(newY, maxY));
}

function handleDragEnd() {
	isPanelDragging = false;
}
