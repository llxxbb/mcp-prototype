export class Marker {
    constructor(container) {
        this.container = container;
        this.markers = [];
        
        // 动态添加标记样式
        const style = document.createElement('style');
        style.textContent = `
            .mcp-marker {
                position: absolute;
                width: 15px;
                height: 15px;
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
        document.head.appendChild(style);
        console.log('Marker css appended');
    }

    // 为指定元素添加标记
    addMarker(element) {
        if (!element.dataset.marker) {
            console.warn('Element has no data-marker attribute:', element);
            return;
        }

        const marker = document.createElement('div');
        marker.className = 'mcp-marker';
        
        // 确保标记可见的计算逻辑
        const rect = element.getBoundingClientRect();
        const offsetX = -15; // 向左偏移15px
        const offsetY = -15; // 向上偏移15px
        
        marker.style.position = 'fixed';
        marker.style.left = `${rect.left + offsetX}px`;
        marker.style.top = `${rect.top + offsetY}px`;
        marker.style.zIndex = '2147483647'; // 最大z-index值
        marker.style.pointerEvents = 'none'; // 防止标记阻挡交互
        
        // 设置标记内容和ID
        marker.dataset.markerId = element.dataset.marker;
        marker.textContent = element.dataset.marker;
        
        // 确保目标元素有相对定位
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(marker);
        console.log('Added marker to element:', element, 'at position:', 
                   element.getBoundingClientRect());
        
        // 添加交互效果
        marker.addEventListener('mouseenter', () => {
            marker.style.transform = 'scale(1.5)';
        });
        
        marker.addEventListener('mouseleave', () => {
            marker.style.transform = 'scale(1)';
        });
        

        this.markers.push(marker);
        return marker;
    }

    // 为容器内所有带data-marker属性的元素添加标记
    addAllMarkers() {
        const elements = this.container.querySelectorAll('[data-marker]');
        elements.forEach(el => this.addMarker(el));
    }
}