document.addEventListener('DOMContentLoaded', function () {
	console.log('mcp-prototype-inject.ts loaded');
	// 动态加载marker模块
	import('/marker.js')
		.then((module) => {
			// 创建 Marker 对象
			const marker = new module.Marker(document.body);
			// 显示 Marker
			marker.addAllMarkers();
		})
		.catch((err) => {
			console.error('Failed to load marker module:', err);
		});
});
