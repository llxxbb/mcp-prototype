const markerCss = `
            .mcp-marker {
                position: fixed;
                z-index: 9999;
                width: 10px;
                height: 10px;
                background-color: rgba(255, 0, 0, 0.7);
                border-radius: 50%;
                border: 1px solid white;
                box-shadow: 0 0 3px rgba(0,0,0,0.3);
                transform: none;
                transition: transform 0.2s ease-out;
                cursor: pointer;
                z-index: 2147483647;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                pointer-events: auto;
                outline: 1px solid rgba(255,255,255,0.5);
              }
            .mcp-marker:hover {
                transform: scale(1.5);
            }
            [data-marker] {
                position: relative;
                overflow: visible !important;
            }
        `;
export class Marker {
	constructor(container) {
		this.container = container;

		// 动态添加标记样式
		const style = document.createElement('style');
		style.textContent = markerCss;
		document.head.appendChild(style);
		console.log('Marker css appended');
	}

	// 为指定元素添加标记
	addMarker(element) {
		const rect = element.getBoundingClientRect();

		const marker = document.createElement('div');

		function updatePosition() {
			marker.className = 'mcp-marker';
			marker.style.left = `${rect.left - 5}px`;
			marker.style.top = `${rect.top - 5}px`;
		}
		updatePosition();
		window.addEventListener('scroll', updatePosition);
		window.addEventListener('resize', updatePosition);
        new ResizeObserver(updatePosition).observe(element);
		// // 设置标记内容和ID
		// marker.dataset.markerId = element.dataset.marker;
		// marker.textContent = element.dataset.marker;

		this.container.appendChild(marker);
	}

	// 为容器内所有带data-marker属性的元素添加标记
	addAllMarkers() {
		const elements = this.container.querySelectorAll('[data-marker]');
		elements.forEach((el) => this.addMarker(el));
	}
}
