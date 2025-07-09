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

		// 添加页面卸载时的自动清理
		window.addEventListener('beforeunload', () => this.cleanup());

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

		// 存储marker引用
		this.markers.add(marker);

		// 如果这是第一个marker，添加统一的滚动事件监听
		if (this.markers.size === 1) {
			this._scrollHandler = () => {
				this.markers.forEach(m => this.updateMarkerPosition(m));
			};
			window.addEventListener('scroll', this._scrollHandler, { passive: true });
		}
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

		// 添加窗口resize事件监听
		if (!this._resizeHandler) {
			this._resizeHandler = () => {
				this.markers.forEach(marker => this.updateMarkerPosition(marker));
			};
			window.addEventListener('resize', this._resizeHandler, { passive: true });
		}
	}

	// 移除单个标记
	removeMarker(marker) {
		if (marker._resizeObserver) {
			marker._resizeObserver.disconnect();
		}
		if (marker.parentNode) {
			marker.parentNode.removeChild(marker);
		}
		this.markers.delete(marker);
	}

	/**
	 * 清理所有资源，需要手动调用
	 * 建议在组件卸载或不再需要标记时调用
	 * 注意：这不是浏览器自动调用的方法
	 */
	cleanup() {
		this.markers.forEach(marker => this.removeMarker(marker));
		this.markers.clear();
		
		// 移除窗口resize和scroll事件监听
		if (this._resizeHandler) {
			window.removeEventListener('resize', this._resizeHandler);
			this._resizeHandler = null;
		}
		if (this._scrollHandler) {
			window.removeEventListener('scroll', this._scrollHandler);
			this._scrollHandler = null;
		}
	}
}