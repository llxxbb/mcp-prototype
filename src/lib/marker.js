export class Marker {
    constructor(container) {
        this.container = container;
        this.markers = [];
    }

    // 为指定元素添加标记
    addMarker(element) {
        if (!element.dataset.marker) return;

        const marker = document.createElement('div');
        marker.className = 'mcp-marker';
        
        // 计算相对于容器元素的位置
        const rect = element.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        marker.style.left = `${rect.left - containerRect.left - 5}px`;
        marker.style.top = `${rect.top - containerRect.top - 5}px`;
        
        // 设置标记内容和ID
        marker.dataset.markerId = element.dataset.marker;
        marker.textContent = element.dataset.marker;
        
        // 添加交互效果
        marker.addEventListener('mouseenter', () => {
            marker.style.transform = 'scale(1.5)';
        });
        
        marker.addEventListener('mouseleave', () => {
            marker.style.transform = 'scale(1)';
        });
        
        marker.addEventListener('click', () => {
            const relatedEl = this.container.querySelector(
                `[data-marker="${marker.dataset.markerId}"]`
            );
            if (relatedEl) {
                relatedEl.classList.add('mcp-highlight');
                setTimeout(() => relatedEl.classList.remove('mcp-highlight'), 2000);
            }
        });

        this.container.appendChild(marker);
        this.markers.push(marker);
        return marker;
    }

    // 为容器内所有带data-marker属性的元素添加标记
    addAllMarkers() {
        const elements = this.container.querySelectorAll('[data-marker]');
        elements.forEach(el => this.addMarker(el));
    }
}