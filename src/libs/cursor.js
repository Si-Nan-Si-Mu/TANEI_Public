/**
 * TANEI 自定义光标 - 跟随式圆点 + 光环
 * 仅在非触摸设备生效
 */
(function () {
    'use strict';

    // 触摸设备不启用自定义光标
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // 仅精确可交互元素：链接、按钮、表单控件、输入框等（不含整块容器如 .card .member）
    const hoverSelectors = 'a, button, [role="button"], input, textarea, select, [contenteditable="true"], .btn, .dept-link, .nav-link, #sidebar-toggle';

    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';

    const ring = document.createElement('div');
    ring.className = 'custom-cursor-ring';

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-cursor';
    wrapper.appendChild(dot);
    wrapper.appendChild(ring);
    document.body.appendChild(wrapper);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let isHover = false;
    let isVisible = true;

    // 平滑跟随：光环有延迟
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function animate() {
        ringX = lerp(ringX, mouseX, 0.2);
        ringY = lerp(ringY, mouseY, 0.2);

        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        wrapper.classList.toggle('hover', isHover);
        wrapper.classList.toggle('hidden', !isVisible);

        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isVisible = true;
    });

    document.addEventListener('mouseleave', () => {
        isVisible = false;
    });

    function checkHover(target) {
        const inMemberOrCard = target && target.closest && target.closest('.member, .card');
        if (inMemberOrCard) {
            // 在 .member/.card 内：仅当鼠标在链接或按钮上时才触发
            return target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]') !== null;
        }
        return target.closest(hoverSelectors) !== null;
    }

    document.addEventListener('mouseover', (e) => {
        isHover = checkHover(e.target);
    });

    document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget || !e.relatedTarget.closest) return;
        const stillInside = checkHover(e.relatedTarget);
        const wasInside = checkHover(e.target);
        if (wasInside && !stillInside) isHover = false;
    });
})();
