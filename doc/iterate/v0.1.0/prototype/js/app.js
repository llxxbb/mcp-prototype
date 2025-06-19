// MCP Prototype v0.1.0 - 交互逻辑

class MCPPrototype {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.loadInitialContent();
    }

    initElements() {
        this.container = document.querySelector('.mcp-container');
        this.sidebar = document.querySelector('.mcp-sidebar');
        this.helper = document.querySelector('.mcp-helper');
        this.prototypeView = document.querySelector('.mcp-prototype-view');
        this.helperContent = document.querySelector('.mcp-helper-content');
        this.toggleButtons = document.querySelectorAll('.mcp-toggle-btn');
    }

    bindEvents() {
        // 使用事件委托处理导航点击
        document.querySelector('.mcp-nav').addEventListener('click', (e) => {
            if (e.target.classList.contains('mcp-nav-item')) {
                this.loadPrototype(e.target.dataset.target);
                this.updateHelperContent(e.target.dataset.target);
            }
        });

        // 切换按钮事件
        this.toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const parent = btn.parentElement;
                parent.classList.toggle('active');
                btn.textContent = parent.classList.contains('active') ? '显示' : '隐藏';
            });
        });


    }

    loadPrototype(prototypeId) {
        const prototypes = {
            'prototype1': `
                <div class="mcp-prototype-content">
                    <h1 data-marker="第一个原型">原型1 - 登录界面</h1>
                    
                    <div class="mcp-form" data-marker="用户名和密码">
                        <div class="mcp-form-group">
                            <label for="username">用户名</label>
                            <input type="text" id="username" placeholder="请输入用户名">
                        </div>
                        
                        <div class="mcp-form-group">
                            <label for="password">密码</label>
                            <input type="password" id="password" placeholder="请输入密码">
                        </div>
                        
                        <button class="mcp-btn" data-marker="点击">登录</button>
                    </div>
                </div>
            `,
            'prototype2': `
                <div class="mcp-prototype-content">
                    <h1 data-marker="原型2">原型2 - 仪表盘</h1>
                    
                    <div class="mcp-dashboard">
                        <div class="mcp-widget" data-marker="2">
                            <h3>用户统计</h3>
                            <div class="mcp-widget-content">
                                <p>活跃用户: 1,234</p>
                                <p>新增用户: 56</p>
                            </div>
                        </div>
                        
                        <div class="mcp-widget" data-marker="3">
                            <h3>销售数据</h3>
                            <div class="mcp-widget-content">
                                <p>今日销售额: ¥12,345</p>
                                <p>本月销售额: ¥234,567</p>
                            </div>
                        </div>
                        
                        <div class="mcp-widget" data-marker="4">
                            <h3>通知中心</h3>
                            <div class="mcp-widget-content">
                                <p>3条未读消息</p>
                                <p>2个待处理任务</p>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };

        if (prototypes[prototypeId]) {
            this.prototypeView.innerHTML = prototypes[prototypeId];
            this.addMarkers();
        } else {
            this.prototypeView.innerHTML = '<p>原型不存在</p>';
        }
    }

    loadInitialContent() {
        // 默认加载第一个原型
        const firstNavItem = document.querySelector('.mcp-nav-item');
        if (firstNavItem) {
            this.loadPrototype(firstNavItem.dataset.target);
            this.updateHelperContent(firstNavItem.dataset.target);
        }
    }

    updateHelperContent(prototypeId) {
        const helperContents = {
            'prototype1': `
                <h3>登录界面说明</h3>
                <p>这是系统的登录界面原型，包含以下元素：</p>
                <ul>
                    <li>用户名输入框</li>
                    <li>密码输入框</li>
                    <li>登录按钮</li>
                </ul>
                <p>点击标记可以查看各元素的交互效果。</p>
            `,
            'prototype2': `
                <h3>仪表盘说明</h3>
                <p>这是系统的仪表盘原型，包含以下组件：</p>
                <ul>
                    <li>用户统计面板</li>
                    <li>销售数据面板</li>
                    <li>通知中心面板</li>
                </ul>
                <p>点击标记可以查看各面板的详细信息。</p>
            `
        };

        if (helperContents[prototypeId]) {
            this.helperContent.innerHTML = helperContents[prototypeId];
        } else {
            this.helperContent.innerHTML = '<p>暂无此原型的说明文档</p>';
        }
    }

    addMarkers() {
        // 清空所有类型的现有标记
        document.querySelectorAll('.mcp-marker, .marker').forEach(marker => marker.remove());

        // 添加新标记
        const elements = this.prototypeView.querySelectorAll('[data-marker]');
        elements.forEach(el => {
            const marker = document.createElement('div');
            marker.className = 'mcp-marker';
            
            const rect = el.getBoundingClientRect();
            
            // 固定到原型视图区域
            const contentRect = this.prototypeView.getBoundingClientRect();
            
            // 使用绝对坐标+悬浮方案（带边界检查）
            // 设置标记样式
            // 计算相对于视口的绝对位置
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;
            
            // 设置标记位置 - 相对于原型视图容器
            marker.style.left = `${rect.left - this.prototypeView.getBoundingClientRect().left - 5}px`;
            marker.style.top = `${rect.top - this.prototypeView.getBoundingClientRect().top - 5}px`;
            
            // 添加到原型视图容器
            this.prototypeView.appendChild(marker);
            
            // 添加鼠标悬停效果
            marker.addEventListener('mouseenter', () => {
                marker.style.transform = 'scale(1.5)';
            });
            marker.addEventListener('mouseleave', () => {
                marker.style.transform = 'scale(1)';
            });
            
            // 设置标记内容和ID
            marker.dataset.markerId = el.dataset.marker;
            marker.dataset.marker = `${el.dataset.marker}`;
            
            // 添加点击事件
            marker.addEventListener('click', () => {
                // 高亮关联元素
                const relatedEl = this.prototypeView.querySelector(`[data-marker="${marker.dataset.markerId}"]`);
                if (relatedEl) {
                    relatedEl.classList.add('mcp-highlight');
                    setTimeout(() => relatedEl.classList.remove('mcp-highlight'), 2000);
                }
            });
        });
    }


}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new MCPPrototype();
});