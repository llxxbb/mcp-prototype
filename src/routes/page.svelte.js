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
	rightSidebarVisible.update((value) => !value);
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

// 拖拽相关变量
let isPanelDragging = false;
let dragStart = { x: 0, y: 0 };
let dragDoc;
let currentPosition = { x: 0, y: 0 };
let toolboxElement = null;

// 禁用 iframe 的指针事件
function disableIframePointerEvents() {
	if (typeof document === 'undefined') return;
	const iframes = document.querySelectorAll('iframe');
	iframes.forEach(iframe => {
		iframe.style.pointerEvents = 'none';
	});
}

// 恢复 iframe 的指针事件
function enableIframePointerEvents() {
	if (typeof document === 'undefined') return;
	const iframes = document.querySelectorAll('iframe');
	iframes.forEach(iframe => {
		iframe.style.pointerEvents = '';
	});
}

// 事件监听器
const moveListener = (event) => {
	if (!isPanelDragging || !toolboxElement) return;
	
	event.preventDefault();
	event.stopPropagation();
	
	const newX = event.clientX - dragStart.x;
	const newY = event.clientY - dragStart.y;
	const maxX = window.innerWidth - 100;
	const maxY = window.innerHeight - 50;
	
	currentPosition = {
		x: Math.max(0, Math.min(newX, maxX)),
		y: Math.max(0, Math.min(newY, maxY))
	};
	
	toolboxElement.style.transform = `translate(${currentPosition.x}px, ${currentPosition.y}px)`;
};

const upListener = () => dragEnd();

export function dragInit(doc) {
	if (typeof document === 'undefined') return;
	
	dragDoc = doc;
	const initialPosition = { x: window.innerWidth - 130, y: 0 };
	panelPosition.set(initialPosition);
	currentPosition = { ...initialPosition };
	
	const toolbox = document.getElementById('toolbox');
	if (toolbox) {
		toolbox.style.transform = `translate(${initialPosition.x}px, ${initialPosition.y}px)`;
	}
}

export function handleDragStart(event) {
	if (typeof document === 'undefined') return;
	
	isPanelDragging = true;
	toolboxElement = event.target.closest('#toolbox') || document.getElementById('toolbox');
	
	panelPosition.subscribe(value => {
		currentPosition = { ...value };
	})();
	
	dragStart.x = event.clientX - currentPosition.x;
	dragStart.y = event.clientY - currentPosition.y;
	
	dragDoc.addEventListener('mousemove', moveListener, { capture: true });
	dragDoc.addEventListener('mouseup', upListener, { capture: true });
	
	// 防止文本选择
	dragDoc.body.style.userSelect = 'none';
	
	// 禁用 iframe 指针事件
	disableIframePointerEvents();
	
	event.preventDefault();
	event.stopPropagation();
}

export function dragEnd() {
	isPanelDragging = false;
	
	if (currentPosition) {
		panelPosition.set(currentPosition);
	}
	
	// 恢复用户选择
	if (dragDoc && dragDoc.body) {
		dragDoc.body.style.userSelect = '';
	}
	
	// 恢复 iframe 指针事件
	enableIframePointerEvents();
	
	toolboxElement = null;
	
	if (dragDoc) {
		dragDoc.removeEventListener('mousemove', moveListener, { capture: true });
		dragDoc.removeEventListener('mouseup', upListener, { capture: true });
	}
}
