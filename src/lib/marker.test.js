import { Marker } from './marker.js';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Marker', () => {
	let container;
	let marker;

	beforeEach(() => {
		// 创建测试容器
		container = document.createElement('div');
		document.body.appendChild(container);

		// 添加测试元素
		const element = document.createElement('div');
		element.dataset.marker = 'test-marker';
		container.appendChild(element);

		// 初始化Marker
		marker = new Marker(container);
	});

	afterEach(() => {
		document.body.removeChild(container);
	});

	it('should add marker to element', () => {
		const element = container.querySelector('[data-marker]');
		const addedMarker = marker.addMarker(element);

		expect(addedMarker).toBeDefined();
		expect(addedMarker.className).toBe('mcp-marker');
		expect(addedMarker.dataset.markerId).toBe('test-marker');
	});

	it('should add all markers in container', () => {
		// 添加第二个元素
		const element2 = document.createElement('div');
		element2.dataset.marker = 'test-marker2';
		container.appendChild(element2);

		marker.addAllMarkers();
		const markers = container.querySelectorAll('.mcp-marker');
		expect(markers.length).toBe(2);
	});

	it('should highlight element when marker is clicked', () => {
		const element = container.querySelector('[data-marker]');
		const addedMarker = marker.addMarker(element);

		addedMarker.dispatchEvent(new Event('click'));
		expect(element.classList.contains('mcp-highlight')).toBe(true);
	});
});
