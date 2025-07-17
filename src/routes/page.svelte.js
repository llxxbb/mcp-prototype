import {
	leftSidebarVisible,
	rightSidebarVisible,
	currentContentUrl,
	currentContentHelp,
	panelPosition
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

// 用于 Svelte 响应式的 panelPosition
let isPanelDragging = false;
let dragStart = { x: 0, y: 0 };
let dragDoc;

// Svelte 组件可调用此方法来设置 panelPosition
export function setPanelPosition(pos) {
	panelPosition.set(pos);
}

const moveListener = (event) => handleDragMove(event);
const upListener = () => handleDragEnd();

export function dragInit(doc) {
	dragDoc = doc;
	// 初始位置
	panelPosition.set({ x: window.innerWidth - 130, y: 0 });
}

export function handleDragStart(event) {
	isPanelDragging = true;
	let current;
	panelPosition.subscribe(v => current = v)();
	dragStart.x = event.clientX - current.x;
	dragStart.y = event.clientY - current.y;
	dragDoc.addEventListener('mousemove', moveListener);
	dragDoc.addEventListener('mouseup', upListener);
	event.preventDefault();
}

function handleDragMove(event) {
	if (!isPanelDragging) return;
	let current;
	panelPosition.subscribe(v => current = v)();
	const newX = event.clientX - dragStart.x;
	const newY = event.clientY - dragStart.y;
	const maxX = window.innerWidth - 100;
	const maxY = window.innerHeight - 50;
	panelPosition.set({
		x: Math.max(0, Math.min(newX, maxX)),
		y: Math.max(0, Math.min(newY, maxY))
	});
}

export function dragEnd() {
	isPanelDragging = false;
	if (dragDoc) {
		dragDoc.removeEventListener('mousemove', moveListener);
		dragDoc.removeEventListener('mouseup', upListener);
	}
}
