document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = toggleButton.querySelector('span');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.add('sidebar-collapsed');
    }

    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-collapsed');
        
        // 旋转动画逻辑
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        // 手机端收起时显示+，展开时显示×（旋转45度）
        if (sidebar.classList.contains('sidebar-collapsed')) {
            toggleButton.style.transform = 'rotate(0deg)';
        } else {
            toggleButton.style.transform = 'rotate(45deg)'; // 展开时变成 X
        }
    });
});