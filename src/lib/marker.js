const markerCss = `
            .mcp-marker {
                position: fixed;
                z-index: 9999;
                width: 10px;
                height: 10px;
                background-color: rgba(255, 0, 0, 0.3);
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
		this.markers = new Set(); // 存储所有创建的标记

		// 动态添加标记样式
		const style = document.createElement('style');
		style.textContent = markerCss;
		document.head.appendChild(style);
		console.log('Marker css appended');
	}

	// 为指定元素添加标记
	addMarker(element) {
		const marker = document.createElement('div');
		marker.className = 'mcp-marker';

		// 保存目标元素引用
		marker._targetElement = element;
		
		// 初始位置计算
		this.updateMarkerPosition(marker);

		// 添加到容器
		this.container.appendChild(marker);

		// 添加滚动事件监听并存储引用
		const scrollHandler = () => this.updateMarkerPosition(marker);
		window.addEventListener('scroll', scrollHandler, { passive: true });
		marker._scrollHandler = scrollHandler;
	}

	updateMarkerPosition(marker) {
		const rect = marker._targetElement.getBoundingClientRect();
		marker.style.left = `${rect.left - 5}px`;
		marker.style.top = `${rect.top - 5}px`;
	}

	// 为容器内所有带data-marker属性的元素添加标记
	addAllMarkers() {
		const elements = this.container.querySelectorAll('[data-marker]');
		elements.forEach((el) => this.addMarker(el));
	}

}