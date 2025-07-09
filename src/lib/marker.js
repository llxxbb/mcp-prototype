const markerCss = `
            .mcp-marker {
                position: fixed;
                width: 10px;
                height: 10px;
                background-color: rgba(255, 0, 0, 0.3);
                border-radius: 50%;
                border: 1px solid white;
                box-shadow: 0 0 3px rgba(0,0,0,0.3);
                transform: none;
                transition: transform 0.2s ease-out;
                cursor: pointer;
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
            
            .mcp-marker .mcp-tooltip {
                position: fixed;
                padding: 4px 8px;
                background-color: #333;
                color: #fff;
                border-radius: 4px;
                font-size: 10px;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s, visibility 0.2s;
                z-index: 10000;
                pointer-events: none;
                will-change: transform, opacity, visibility;
            }
            .mcp-marker:hover > .mcp-tooltip {
                opacity: 1;
                visibility: visible;
            }
        `;
export class Marker {
	constructor(container) {
		this.container = container;
		this.markers = new Set(); // 存储所有创建的标记
		this.zIndexCounter = 9999; // z-index计数器，从9999开始

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
			marker._targetElement = element;
			marker.style.zIndex = this.zIndexCounter--; // 设置z-index并递减

			// 添加tooltip作为marker的子元素
			const tooltip = document.createElement('div');
			tooltip.className = 'mcp-tooltip';
			tooltip.textContent = element.getAttribute('data-marker') || '';
			marker.appendChild(tooltip);
		
		this.container.appendChild(marker);


		// 关联tooltip和marker
		marker._tooltip = tooltip;

        		// 初始位置计算
		this.updateMarkerPosition(marker);
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
		const left = rect.left - 5;
		const top = rect.top - 5;
		
		marker.style.left = `${left}px`;
		marker.style.top = `${top}px`;
		
		if (marker._tooltip) {
			marker._tooltip.style.left = `15px`;
			marker._tooltip.style.top = `-5px`;
		}
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