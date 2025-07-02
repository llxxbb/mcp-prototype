document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // 阻止表单默认提交行为
        
        // 模拟用户不存在的情况
        alert('用户不存在！');
        
        // 实际应用中这里应该是AJAX请求验证用户
        // 例如：
        // const username = document.getElementById('username').value;
        // const password = document.getElementById('password').value;
        // validateUser(username, password)
        //     .then(response => {
        //         if (!response.exists) {
        //             alert('用户不存在！');
        //         }
        //     });
    });
});

// 示例验证函数（实际应用中需要实现）
function validateUser(username, password) {
    // 这里应该是实际的验证逻辑
    return Promise.resolve({ exists: false });
}