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
                position: absolute;
                padding: 4px 8px;
                background-color: #333;
                color: #fff;
                border-radius: 4px;
                font-size: 10px;
                white-space: normal;
                word-wrap: break-word;
                max-width: 300px;
                min-width: 100px;
                display: block;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.2s, visibility 0.2s;
                z-index: 10000;
                pointer-events: none;
                will-change: transform, opacity, visibility;
                box-sizing: border-box;
                line-height: 1.2;
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
				this.markers.forEach((m) => this.updateMarkerPosition(m));
			};
			window.addEventListener('scroll', this._scrollHandler, { passive: true });
		}
	}

	updateMarkerPosition(marker) {
		const rect = marker._targetElement.getBoundingClientRect();

		// 计算标记位置（基于元素中心点）
		const left = rect.left - 5; // 减去标记宽度的一半
		const top = rect.top - 5; // 减去标记高度的一半

		// 获取视口尺寸（考虑iframe情况和滚动条）
		const viewportHeight = window.innerHeight;

		// 获取实际可用宽度（考虑滚动条）
		const availableWidth = document.documentElement.clientWidth;

		// 获取文档可见区域的高度（考虑滚动位置和iframe）
		const documentHeight = Math.max(
			document.body.scrollHeight,
			document.body.offsetHeight,
			document.documentElement.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight
		);

		// 如果在iframe中，使用iframe的实际可见高度
		let visibleHeight;
		if (window !== window.top) {
			// 在iframe中，使用iframe的clientHeight
			visibleHeight = document.documentElement.clientHeight;
		} else {
			// 不在iframe中，使用原来的逻辑
			visibleHeight = Math.min(viewportHeight, documentHeight - window.scrollY);
		}

		// 边界检查 - 确保标记不会显示在视口外
		const boundedLeft = Math.max(0, Math.min(left, availableWidth - 10));
		const boundedTop = Math.max(0, Math.min(top, viewportHeight - 10));

		// 设置标记位置
		marker.style.left = `${boundedLeft}px`;
		marker.style.top = `${boundedTop}px`;

		// 重置tooltip样式，避免之前的样式影响
		if (marker._tooltip) {
			marker._tooltip.style.maxHeight = '';
			marker._tooltip.style.overflow = '';
			marker._tooltip.style.maxWidth = '';
		}

		if (marker._tooltip) {
			// 获取tooltip尺寸
			const tooltipRect = marker._tooltip.getBoundingClientRect();
			const tooltipWidth = tooltipRect.width || 100;
			const tooltipHeight = tooltipRect.height || 20;

			// 水平位置计算：优先显示在右侧，否则显示在左侧
			const rightSpace = boundedLeft + 10 + tooltipWidth;
			const leftSpace = boundedLeft - tooltipWidth;

			if (rightSpace <= availableWidth) {
				// 右侧空间足够，在右侧显示
				marker._tooltip.style.left = `15px`;
				marker._tooltip.style.right = `auto`;
			} else if (leftSpace >= 0) {
				// 左侧空间足够，在左侧显示
				marker._tooltip.style.left = `auto`;
				marker._tooltip.style.right = `15px`;
			} else {
				// 两侧空间都不足，调整tooltip宽度或位置
				if (tooltipWidth > availableWidth - 20) {
					// tooltip太宽，调整最大宽度
					marker._tooltip.style.maxWidth = `${availableWidth - 20}px`;
					marker._tooltip.style.left = `15px`;
					marker._tooltip.style.right = `auto`;
				} else {
					// 强制在右侧显示，但确保不超出边界
					const maxLeft = availableWidth - tooltipWidth - 5;
					const adjustedLeft = Math.max(15, maxLeft);
					marker._tooltip.style.left = `${adjustedLeft}px`;
					marker._tooltip.style.right = `auto`;
				}
			}

			// 垂直位置计算：优先显示在右侧居中，然后根据空间情况调整
			const topSpace = boundedTop;
			const bottomSpace = visibleHeight - boundedTop - 10;

			// 计算tooltip垂直居中的位置
			const centerOffset = (tooltipHeight - 10) / 2; // 10是marker的高度

			// 检查是否有足够空间进行居中显示
			const canCenter =
				boundedTop - centerOffset >= 0 &&
				boundedTop + centerOffset + tooltipHeight <= visibleHeight;

			if (canCenter) {
				// 空间足够，显示在右侧居中
				marker._tooltip.style.top = `-${centerOffset}px`;
			} else if (bottomSpace >= tooltipHeight + 5) {
				// 下方空间足够，tooltip显示在标记下方
				marker._tooltip.style.top = `15px`;
			} else if (topSpace >= tooltipHeight + 5) {
				// 上方空间足够，tooltip显示在标记上方
				// 正常显示在标记上方，保持完整高度
				marker._tooltip.style.top = `-${tooltipHeight + 5}px`;
				// 确保不设置maxHeight和overflow，保持tooltip完整显示
				marker._tooltip.style.maxHeight = '';
				marker._tooltip.style.overflow = '';
			} else {
				// 空间都不足，强制显示在下方，但确保不超出可见区域底部
				const maxBottomOffset = visibleHeight - boundedTop - 10 - 5; // 距离可见区域底部至少5px
				const tooltipBottomOffset = Math.min(tooltipHeight + 5, maxBottomOffset);
				marker._tooltip.style.top = `15px`;
				// 如果tooltip会超出可见区域底部，调整其最大高度
				if (tooltipBottomOffset < tooltipHeight) {
					marker._tooltip.style.maxHeight = `${tooltipBottomOffset - 5}px`;
					marker._tooltip.style.overflow = 'hidden';
				} else {
					// 确保不设置maxHeight和overflow
					marker._tooltip.style.maxHeight = '';
					marker._tooltip.style.overflow = '';
				}
			}
		}
	}

	// 为容器内所有带data-marker属性的元素添加标记
	addAllMarkers() {
		const elements = this.container.querySelectorAll('[data-marker]');
		elements.forEach((el) => this.addMarker(el));

		// 添加窗口resize事件监听
		if (!this._resizeHandler) {
			this._resizeHandler = () => {
				this.markers.forEach((marker) => this.updateMarkerPosition(marker));
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
		this.markers.forEach((marker) => this.removeMarker(marker));
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
